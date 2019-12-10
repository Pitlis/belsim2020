using AutoMapper;
using belsim2020.Configuration;
using belsim2020.Services.Interfaces;
using belsim2020.Services.Interfaces.Rk;
using belsim2020.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace belsim2020.Controllers
{
    [Route("api/experiment")]
    [ApiController]
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

        #region Helpers

        private bool IsValidAccessKey(string accessKey)
        {
            return experimentorSettings.AccessKeys.Contains(accessKey);
        }

        #endregion
    }
}