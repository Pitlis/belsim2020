using belsim2020.Entities;
using belsim2020.Services.Interfaces;
using belsim2020.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace belsim2020.Controllers
{
    [Route("api/project")]
    [ApiController]
    [Authorize]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService projectService;
        private readonly ICurrentUserContext userContext;

        public ProjectController(
            IProjectService projectService,
            ICurrentUserContext userContext)
        {
            this.projectService = projectService;
            this.userContext = userContext;
        }

        [HttpPost("create")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> CreateProject([FromBody] CreateProjectViewModel model)
        {
            var projectId = await projectService.CreateProject(
                model.Name,
                model.Organization,
                model.Comments,
                RkExperimentType.RK);

            return new OkObjectResult(projectId.ToString());
        }

        [HttpPut("update")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateProject([FromBody] UpdateProjectViewModel model)
        {
            var project = await projectService.GetProjectInfo(model.ProjectId);
            project.ProjectName = model.Name;
            project.OrganizationName = model.Organization;
            project.Comments = model.Comments;

            await projectService.UpdateProject(project);

            return new OkResult();
        }

        [HttpDelete("delete")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteProject([FromBody] Guid projectId)
        {
            await projectService.DeleteProject(projectId);

            return new OkResult();
        }

        [HttpPost("add-user")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> AddUser([FromBody] AddUserToProjectViewModel model)
        {
            await projectService.AddUserToProject(model.ProjectId, model.UserId, model.IsOwner);

            return new OkResult();
        }

        [HttpPost("delete-user")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteUser([FromBody] DeleteUserFromProjectViewModel model)
        {
            await projectService.DeleteUserFromProject(model.ProjectId, model.UserId);

            return new OkResult();
        }

        [HttpGet("get-info/{projectId}")]
        public async Task<IActionResult> GetProject(Guid projectId)
        {
            var project = await projectService.GetProjectInfo(projectId);

            var model = new ProjectInfoViewModel()
            {
                ProjectId = project.ProjectId,
                CreatedAt = project.CreatedAt,
                ModifiedAt = project.ModifiedAt,
                ProjectName = project.ProjectName,
                OrganizationName = project.OrganizationName,
                Comments = project.Comments,
                ProjectType = project.ProjectType,
                Owners = project.Users.Where(up => up.IsProjectOwner)
                .Select(up => new UserNameViewModel()
                {
                    UserId = up.User.Id,
                    Name = up.User.PublicName
                }).ToList(),
                AssignedUsers = project.Users
                .Select(up => new UserNameViewModel()
                {
                    UserId = up.User.Id,
                    Name = up.User.PublicName
                }).ToList()
            };

            return new OkObjectResult(model);
        }

        [HttpGet("get-available-projects")]
        public async Task<IActionResult> GetAvailableProjects()
        {
            var availableProjects = await projectService.GetAvailableProjectsList(userContext.UserId);

            return new OkObjectResult(availableProjects);
        }
    }
}