using belsim2020.Database;
using belsim2020.Entities;
using belsim2020.Services.Extensions;
using belsim2020.Services.Interfaces;
using belsim2020.Services.Interfaces.Rk;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace belsim2020.Services.Implementations.Rk
{
    public class ResourceService : IResourceService
    {
        private readonly Belsim2020DbContext dbContext;
        private readonly ICurrentUserContext userContext;
        private readonly ILogger<ResourceService> logger;

        public ResourceService(
            Belsim2020DbContext dbContext,
            ICurrentUserContext userContext,
            ILogger<ResourceService> logger)
        {
            this.dbContext = dbContext;
            this.userContext = userContext;
            this.logger = logger;
        }

        public async Task CreateResource(RkResource resource)
        {
            await VerifyProjectExists(resource.ProjectId);
            await VerifyProjectAccess(resource.ProjectId);

            resource.NormalizedName = resource.Name.ToLowerInvariant();
            var existsResource = await dbContext.RkResources.FirstOrDefaultAsync(r =>r.ProjectId == resource.ProjectId && r.NormalizedName == resource.NormalizedName);
            if (existsResource != null)
            {
                throw new ApplicationException($"Resource with name [{resource.Name}] already exists");
            }

            await dbContext.RkResources.AddAsync(resource);

            await dbContext.SaveChangesAsync();
        }

        public async Task DeleteResource(Guid resourceId)
        {
            await VerifyProjectAccess(resourceId);

            var resource = await dbContext.RkResources.FirstOrDefaultAsync(up => up.RkResourceId == resourceId);
            if (resource == null)
            {
                throw new ApplicationException($"Resource [{resourceId}] does not exists");
            }

            var resourceInExperiments = await dbContext.RkResourcesInExperiment.Where(r => r.ResourceId == resourceId).ToListAsync();
            if (resourceInExperiments.Count > 0)
            {
                throw new ApplicationException($"Resource [{resourceId}] cannot be removed - it is used in experiments");
            }

            dbContext.RkResources.Remove(resource);
            await dbContext.SaveChangesAsync();
        }

        public async Task<IList<RkResource>> GetAllResources(Guid projectId)
        {
            await VerifyProjectAccess(projectId);

            return await dbContext.RkResources.Where(r => r.ProjectId == projectId).ToListAsync();
        }

        #region Helpers

        private async Task VerifyProjectAccess(Guid projectId)
        {
            if (!userContext.IsAdmin() && await dbContext.UserProjects.FirstOrDefaultAsync(up => up.ProjectId == projectId && up.UserId == userContext.UserId) == null)
            {
                throw new ApplicationException($"Current user [{userContext.UserId}] cannot execute this action for project [{projectId}]");
            }
        }

        private async Task VerifyProjectExists(Guid projectId)
        {
            if (await dbContext.Projects.FirstOrDefaultAsync(p => p.ProjectId == projectId) == null)
            {
                throw new ApplicationException($"Project [{projectId}] does not exists");
            }
        }

        #endregion
    }
}
