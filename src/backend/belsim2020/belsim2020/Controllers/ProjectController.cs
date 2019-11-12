using AutoMapper;
using belsim2020.Entities;
using belsim2020.Services.Interfaces;
using belsim2020.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
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
        private readonly IMapper mapper;

        public ProjectController(
            IProjectService projectService,
            ICurrentUserContext userContext,
            IMapper mapper)
        {
            this.projectService = projectService;
            this.userContext = userContext;
            this.mapper = mapper;
        }

        [HttpPost("create")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> CreateProject([FromBody] CreateProjectViewModel viewModel)
        {
            var model = mapper.Map<Project>(viewModel);
            model.ProjectType = RkExperimentType.RK;

            var projectId = await projectService.CreateProject(model);

            return new OkObjectResult(projectId.ToString());
        }

        [HttpPut("update")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateProject([FromBody] UpdateProjectViewModel viewModel)
        {
            var project = await projectService.GetProjectInfo(viewModel.ProjectId);
            var model = mapper.Map(viewModel, project);

            await projectService.UpdateProject(model);

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
        public async Task<IActionResult> AddUser([FromBody] AddUserToProjectViewModel viewModel)
        {
            await projectService.AddUserToProject(viewModel.ProjectId, viewModel.UserId, viewModel.IsOwner);

            return new OkResult();
        }

        [HttpPost("delete-user")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteUser([FromBody] DeleteUserFromProjectViewModel viewModel)
        {
            await projectService.DeleteUserFromProject(viewModel.ProjectId, viewModel.UserId);

            return new OkResult();
        }

        [HttpGet("get-info/{projectId}")]
        public async Task<IActionResult> GetProject(Guid projectId)
        {
            var project = await projectService.GetProjectInfo(projectId);

            var model = mapper.Map<ProjectInfoWithUsersViewModel>(project);

            return new OkObjectResult(model);
        }

        [HttpGet("get-available-projects")]
        public async Task<IActionResult> GetAvailableProjects()
        {
            var availableProjects = await projectService.GetAvailableProjectsList(userContext.UserId);

            var model = mapper.Map<IList<ProjectInfoViewModel>>(availableProjects);

            return new OkObjectResult(model);
        }
    }
}