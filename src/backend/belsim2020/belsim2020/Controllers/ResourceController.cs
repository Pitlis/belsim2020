using AutoMapper;
using belsim2020.Entities;
using belsim2020.Services.Interfaces;
using belsim2020.Services.Interfaces.Rk;
using belsim2020.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace belsim2020.Controllers
{
    [Route("api/resource")]
    [ApiController]
    [Authorize]
    public class ResourceController : ControllerBase
    {
        private readonly IResourceService resourceService;
        private readonly ICurrentUserContext userContext;
        private readonly IMapper mapper;

        public ResourceController(
            IResourceService resourceService,
            ICurrentUserContext userContext,
            IMapper mapper)
        {
            this.resourceService = resourceService;
            this.userContext = userContext;
            this.mapper = mapper;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateResource([FromBody] CreateResourceViewModel viewModel)
        {
            var model = mapper.Map<RkResource>(viewModel);

            await resourceService.CreateResource(model);

            return new OkResult();
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteResource([FromBody] Guid resourceId)
        {
            await resourceService.DeleteResource(resourceId);

            return new OkResult();
        }

        [HttpDelete("all")]
        public async Task<IActionResult> GetAllResources([FromBody] Guid projectId)
        {
            var resources = await resourceService.GetAllResources(projectId);
            var model = mapper.Map<IList<ResourceViewModel>>(resources);

            return new OkObjectResult(model);
        }
    }
}