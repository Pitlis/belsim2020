using belsim2020.Database;
using belsim2020.Entities;
using belsim2020.Services.Extensions;
using belsim2020.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace belsim2020.Services.Implementations
{
    public class ProjectService : IProjectService
    {
        private readonly Belsim2020DbContext dbContext;
        private readonly ICurrentUserContext userContext;
        private readonly ILogger<ProjectService> logger;

        public ProjectService(
            Belsim2020DbContext dbContext,
            ICurrentUserContext userContext,
            ILogger<ProjectService> logger)
        {
            this.dbContext = dbContext;
            this.userContext = userContext;
            this.logger = logger;
        }

        public async Task<Guid> CreateProject(string name, string organization, string comments)
        {
            VerifyAdminAccess();

            var project = new Project()
            {
                ProjectName = name,
                OrganizationName = organization,
                Comments = comments,
                CreatedAt = DateTime.UtcNow,
                ModifiedAt = DateTime.UtcNow,
                ProjectType = RkExperimentType.RK
            };

            await dbContext.Projects.AddAsync(project);
            await dbContext.SaveChangesAsync();

            return project.ProjectId;
        }

        public async Task UpdateProject(Project updatedProject)
        {
            VerifyAdminAccess();

            updatedProject.ModifiedAt = DateTime.UtcNow;

            dbContext.Projects.Update(updatedProject);
            await dbContext.SaveChangesAsync();
        }

        public async Task DeleteProject(Guid projectId)
        {
            VerifyAdminAccess();

            var project = await dbContext.Projects.FirstOrDefaultAsync(p => p.ProjectId == projectId);
            if (project == null)
            {
                throw new ApplicationException($"Project [{projectId}] does not exists");
            }

            dbContext.Projects.Remove(project);
            await dbContext.SaveChangesAsync();
        }

        public async Task AddUserToProject(Guid projectId, string userId, bool isOwner = false)
        {
            VerifyAdminAccess();
            await VerifyProjectExists(projectId);
            await VerifyUserExists(userId);

            var existsProjectAssigment = await dbContext.UserProjects.FirstOrDefaultAsync(up => up.ProjectId == projectId && up.UserId == userId);
            if (existsProjectAssigment != null)
            {
                throw new ApplicationException($"User [{userId}] already assigned to project [{projectId}]");
            }

            var projectAssigment = new UserProject()
            {
                ProjectId = projectId,
                UserId = userId,
                IsProjectOwner = isOwner
            };
            await dbContext.UserProjects.AddAsync(projectAssigment);
            await dbContext.SaveChangesAsync();
        }

        public async Task DeleteUserFromProject(Guid projectId, string userId)
        {
            VerifyAdminAccess();

            await VerifyProjectExists(projectId);
            await VerifyUserExists(userId);

            var projectAssigment = await dbContext.UserProjects.FirstOrDefaultAsync(up => up.ProjectId == projectId && up.UserId == userId);
            if (projectAssigment == null)
            {
                throw new ApplicationException($"User [{userId}] does not connected to project [{projectId}]");
            }

            dbContext.UserProjects.Remove(projectAssigment);
            await dbContext.SaveChangesAsync();
        }

        public async Task<IList<Project>> GetAvailableProjectsList(string userId)
        {
            if (userContext.IsAdmin())
            {
                return await dbContext.Projects
                    .ToListAsync();
            }
            return await dbContext.Projects
                .Join(dbContext.UserProjects, p => p.ProjectId, up => up.ProjectId, (p, up) => new { Project = p, Assigment = up })
                .Where(a => a.Assigment.UserId == userId)
                .Select(a => a.Project)
                .ToListAsync();
        }

        public async Task<Project> GetProjectInfo(Guid projectId)
        {
            var project = await dbContext.Projects
                .Include(p => p.Users)
                    .ThenInclude(up => up.User)
                .FirstOrDefaultAsync(p => p.ProjectId == projectId);

            if (project == null)
            {
                throw new ApplicationException($"Project {projectId} does not exists");
            }

            if (userContext.IsAdmin() || project.Users.Select(u => u.UserId).Contains(userContext.UserId))
            {
                return project;
            }
            else
            {
                throw new ApplicationException($"Current user [{userContext.UserId}] does not have access to project [{projectId}]");
            }
        }

        #region Helpers

        private void VerifyAdminAccess()
        {
            if (!userContext.IsAdmin())
            {
                throw new ApplicationException($"Current user [{userContext.UserId}] cannot execute this action");
            }
        }

        private async Task VerifyUserExists(string userId)
        {
            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                throw new ApplicationException($"User [{userId}] does not exists");
            }
        }

        private async Task VerifyProjectExists(Guid projectId)
        {
            var project = await dbContext.Projects.FirstOrDefaultAsync(p => p.ProjectId == projectId);
            if (project == null)
            {
                throw new ApplicationException($"Project [{projectId}] does not exists");
            }
        }

        #endregion
    }
}
