using belsim2020.Integration.Services;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using NLog;
using System;
using System.Configuration;
using System.Diagnostics;
using System.IO;

namespace belsim2020.Integration
{
    class Application
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();

        private readonly ApiService apiService;
        private readonly ExperimenterDataService experimenterDataService;
        private readonly string currentDirectoryPath;
        private readonly int experimentTimeout;

        public Application(
            ApiService apiService,
            ExperimenterDataService experimenterDataService)
        {
            this.apiService = apiService;
            this.experimenterDataService = experimenterDataService;
            this.currentDirectoryPath = Path.GetDirectoryName(Process.GetCurrentProcess().MainModule.FileName);
            this.experimentTimeout = (int)TimeSpan.Parse(ConfigurationManager.AppSettings.Get("ExperimentTimeout")).TotalMilliseconds;
        }

        public void Run()
        {
            // while (true)
            //{
            try
            {
                logger.Info("Getting new experiment from server...");
                var model = apiService.TakeExperimentForProcessing();
                logger.Info($"Experiment {model.ExperimentName} [{model.ExperimentId}] recieved.");

                string dataDirectoryName = DateTime.UtcNow.Ticks.ToString();
                logger.Info($"Creating experiment data folder: [{dataDirectoryName}].");
                var dataDirectory = Directory.CreateDirectory(Path.Combine(currentDirectoryPath, dataDirectoryName));

                string dataPath = Path.Combine(currentDirectoryPath, dataDirectoryName, "data.xml");
                string expscenarPath = Path.Combine(currentDirectoryPath, dataDirectoryName, "expscenario.xml");

                logger.Info($"Creating data model xml.");
                experimenterDataService.WriteModelDataToFile(dataPath, model);

                logger.Info($"Creating expscenario model xml.");
                experimenterDataService.WriteExperimentScenarioToFile(expscenarPath, model);

                logger.Info($"Running experiment process...");
                Process process = new Process();
                process.StartInfo.WorkingDirectory = currentDirectoryPath;
                process.StartInfo.FileName = "experimenter.exe";
                process.StartInfo.Arguments = string.Format("enterprise3.exe {0} {1}", dataPath, expscenarPath);
                process.Start();

                var isCompleted = process.WaitForExit(experimentTimeout);

                if (isCompleted)
                {
                    logger.Info($"Experiment process completed. Checking results...");

                    var results = experimenterDataService.GetResultsFromFile(expscenarPath);
                    if (results.Count > 0)
                    {
                        logger.Info($"Experiment successfully completed.");

                        logger.Info($"Sending success results to server");
                        var serializerSettings = new JsonSerializerSettings();
                        serializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                        logger.Info($"Preparing results...");
                        var data = JsonConvert.SerializeObject(results, serializerSettings);

                        logger.Info($"Sending success results to server...");
                        apiService.SendExperimentResult(data, model.ExperimentId);
                    }
                    else
                    {
                        logger.Info($"Experiment failed.");

                        logger.Info($"Sending failed results to server...");
                        apiService.SendExperimentResult(null, model.ExperimentId);
                    }

                    logger.Info($"Deleting experiment data folder...");
                    dataDirectory.Delete(true);

                    logger.Info($"Deleting logs...");
                    string logFilePath = Path.Combine(currentDirectoryPath, "Log.log");
                    if (File.Exists(logFilePath))
                    {
                        File.Delete(logFilePath);
                    }
                }
                else
                {
                    logger.Info($"Timeout...experiment will be closed");
                    var closed = process.CloseMainWindow();

                    if(closed == false)
                    {
                        process.Kill();
                    }

                    logger.Info($"Experiment process forced completed.");

                    logger.Info($"Sending failed results to server...");
                    apiService.SendExperimentResult(null, model.ExperimentId);
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex);
            }
            Console.ReadKey();
            //}
        }
    }
}
