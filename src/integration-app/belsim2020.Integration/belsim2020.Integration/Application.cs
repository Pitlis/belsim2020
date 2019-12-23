using belsim2020.Integration.Services;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace belsim2020.Integration
{
    class Application
    {
        private readonly ApiService apiService;
        private readonly ExperimenterDataService experimenterDataService;

        public Application(
            ApiService apiService,
            ExperimenterDataService experimenterDataService)
        {
            this.apiService = apiService;
            this.experimenterDataService = experimenterDataService;
        }

        public async Task Run()
        {
            //var model = await apiService.TakeExperimentForProcessing();
            //experimenterDataService.WriteModelDataToFile("D:\\data.xml", model);
            //experimenterDataService.WriteExperimentScenarioToFile("D:\\expscenario.xml", model);
            var t = experimenterDataService.GetResultsFromFile("D:\\expscenario-res-my.xml");
            var serializerSettings = new JsonSerializerSettings();
            serializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            var data = JsonConvert.SerializeObject(t, serializerSettings);
        }
    }
}
