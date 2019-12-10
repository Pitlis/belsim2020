using belsim2020.Integration.Models.ApiModels;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace belsim2020.Integration.Services
{
    public class ApiService
    {
        private readonly string apiAccessKey;
        private readonly string apiBaseUrl;
        private readonly HttpClient client;

        public ApiService()
        {
            apiAccessKey = ConfigurationManager.AppSettings.Get("ApiAccessKey");
            apiBaseUrl = ConfigurationManager.AppSettings.Get("ApiBaseUrl");
            client = new HttpClient();
        }

        public async Task<ApiExperimentModel> TakeExperimentForProcessing()
        {
            var httpContent = new StringContent(JsonConvert.SerializeObject(new { AccessKey = apiAccessKey }), Encoding.UTF8, "application/json");
            var response = await client.PutAsync($"{apiBaseUrl}/take-unprocessed-experiment-for-processing", httpContent);

            var responseString = await response.Content.ReadAsStringAsync();
            if (string.IsNullOrEmpty(responseString))
            {
                return null;
            }

            dynamic experimentDataObject = JsonConvert.DeserializeObject<dynamic>(responseString);
            var experimentData = Convert.ToString(experimentDataObject.experimentData);

            return JsonConvert.DeserializeObject<ApiExperimentModel>(experimentData);
        }
    }
}
