using AutoMapper;
using belsim2020.Configuration;
using belsim2020.Services.Interfaces;
using belsim2020.Services.Interfaces.Rk;
using belsim2020.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace belsim2020.Controllers
{
    [Route("api/experiment")]
    [ApiController]
    [Authorize]
    public class ExperimentController : ControllerBase
    {
        private readonly IExperimentService experimentService;
        private readonly ICurrentUserContext userContext;
        private readonly IMapper mapper;
        private readonly ExperimentorSettings experimentorSettings;

        public ExperimentController(
            IExperimentService experimentService,
            ICurrentUserContext userContext,
            IMapper mapper,
            IOptions<ExperimentorSettings> experimentorSettings)
        {
            this.experimentService = experimentService;
            this.userContext = userContext;
            this.mapper = mapper;
            this.experimentorSettings = experimentorSettings.Value;
        }

        [HttpPut("take-unprocessed-experiment-for-processing")]
        [AllowAnonymous]
        public async Task<IActionResult> GetUnprocessedExperiment([FromBody] BaseIntegrationApiViewModel model)
        {
            if (!IsValidAccessKey(model.AccessKey))
            {
                return new OkObjectResult(null);
            }

            var experiment = await experimentService.GetLastUnprocessedExperiment();
            if (experiment != null)
            {
                //await experimentService.MarkExperimentAsProcessed(experiment.RkExperimentId);
            }

            return new OkObjectResult(experiment);
        }

        [HttpPut("set-experiment-results")]
        [AllowAnonymous]
        public async Task<IActionResult> SetExperimentResults([FromBody] SetExperimentResultViewModel model)
        {
            if (!IsValidAccessKey(model.AccessKey))
            {
                return new BadRequestResult();
            }

            await experimentService.SetExperimentResult(model.ExperimentId, model.ResultJson.ToString());

            return new OkResult();
        }

        [HttpGet("get-experiments-of-project/{projectId}")]
        public async Task<IActionResult> GetExperimentsOfProject(Guid projectId)
        {
            var experiments = await experimentService.GetProjectExperimentsList(projectId);
            var model = mapper.Map<IList<ExperimentShortInfoViewModel>>(experiments);

            return new OkObjectResult(model);
        }

        [HttpGet("get-experiment/{experimentId}")]
        public async Task<IActionResult> GetExperiment(Guid experimentId)
        {
            var experiment = await experimentService.GetExperiment(experimentId);
            var model = mapper.Map<ExperimentViewModel>(experiment);

            return new OkObjectResult(model);
        }

        #region Helpers

        private bool IsValidAccessKey(string accessKey)
        {
            return experimentorSettings.AccessKeys.Contains(accessKey);
        }

        #endregion
    }
}