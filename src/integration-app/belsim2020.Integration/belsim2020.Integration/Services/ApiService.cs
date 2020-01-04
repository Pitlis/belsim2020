using belsim2020.Integration.Models.ApiModels;
using Newtonsoft.Json;
using System;
using System.Configuration;
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

        public ApiExperimentModel TakeExperimentForProcessing()
        {
            var httpContent = new StringContent(JsonConvert.SerializeObject(new { AccessKey = apiAccessKey }), Encoding.UTF8, "application/json");
            var response = client.PutAsync($"{apiBaseUrl}/take-unprocessed-experiment-for-processing", httpContent).Result;

            var responseString = response.Content.ReadAsStringAsync().Result;
            if (string.IsNullOrEmpty(responseString))
            {
                return null;
            }

            dynamic experimentDataObject = JsonConvert.DeserializeObject<dynamic>(responseString);
            var experimentData = Convert.ToString(experimentDataObject.experimentData);

            var result = JsonConvert.DeserializeObject<ApiExperimentModel>(experimentData);
            result.ExperimentName = (string)experimentDataObject.name;
            result.ExperimentId = Guid.Parse((string)experimentDataObject.rkExperimentId);
            return result;
        }

        public void SendExperimentResult(string data, Guid experimentId)
        {
            var httpContent = new StringContent(JsonConvert.SerializeObject(new { AccessKey = apiAccessKey, ResultJson = data, ExperimentId = experimentId }), Encoding.UTF8, "application/json");
            var response = client.PutAsync($"{apiBaseUrl}/set-experiment-results", httpContent).Result;
        }
    }
}
