using AutoMapper;
using belsim2020.Services.Interfaces;
using belsim2020.Services.Interfaces.Rk;
using belsim2020.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using belsim2020.Services.Models;

namespace belsim2020.Controllers
{
    [Route("api/experiment-template")]
    [ApiController]
    [Authorize]
    public class ExperimentTemplateController : ControllerBase
    {
        private readonly IExperimentTemplateService experimentTemplateService;
        private readonly ICurrentUserContext userContext;
        private readonly IMapper mapper;

        public ExperimentTemplateController(
            IExperimentTemplateService experimentTemplateService,
            ICurrentUserContext userContext,
            IMapper mapper)
        {
            this.experimentTemplateService = experimentTemplateService;
            this.userContext = userContext;
            this.mapper = mapper;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateExperimentTemplate([FromBody] CreateExperimentTemplateViewModel viewModel)
        {
            var experimentTemplateId = await experimentTemplateService.CreateExperimentTemplate(
                viewModel.Name, 
                viewModel.Description, 
                viewModel.ProjectId);

            return new OkObjectResult(experimentTemplateId.ToString());
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateExperimentTemplate([FromBody] UpdateExperimentTemplateViewModel viewModel)
        {
            await experimentTemplateService.UpdateExperimentTemplate(mapper.Map<RkExperimentTemplateModel>(viewModel));

            return new OkResult();
        }

        [HttpPut("update-products-list")]
        public async Task<IActionResult> UpdateProductsList([FromBody] UpdateProductsListViewModel viewModel)
        {
            await experimentTemplateService.UpdateProductList(viewModel.ExperimentTemplateId, viewModel.ProductIds);

            return new OkResult();
        }

        [HttpPut("update-resources-list")]
        public async Task<IActionResult> UpdateResourcesList([FromBody] UpdateResourcesListViewModel viewModel)
        {
            await experimentTemplateService.UpdateResourcesList(viewModel.ExperimentTemplateId, viewModel.ResourceIds);

            return new OkResult();
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteExperimentTemplate([FromBody] Guid templateId)
        {
            await experimentTemplateService.DeleteExperimentTemplate(templateId);

            return new OkResult();
        }

        [HttpGet("get-info/{templateId}")]
        public async Task<IActionResult> GetExperimentTemplate(Guid templateId)
        {
            var experimentTemplate = await experimentTemplateService.GetExperimentTemplate(templateId);
            var model = mapper.Map<ExperimentTemplateViewModel>(experimentTemplate);

            return new OkObjectResult(model);
        }

        [HttpGet("templates-in-project/{projectId}")]
        public async Task<IActionResult> GetExperimentTemplatesInProject(Guid projectId)
        {
            var experimentTemplates = await experimentTemplateService.GetExperimentTemplates(projectId);
            var model = mapper.Map<IList<ExperimentTemplateItemViewModel>>(experimentTemplates);

            return new OkObjectResult(model);
        }
    }
}