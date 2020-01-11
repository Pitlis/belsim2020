using belsim2020.Integration.Models.ApiModels;
using belsim2020.Integration.Models.ResultModels;
using belsim2020.Integration.Services;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using NLog;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Threading;

namespace belsim2020.Integration
{
    class Application
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();

        private readonly ApiService apiService;
        private readonly ExperimenterDataService experimenterDataService;
        private readonly string currentDirectoryPath;
        private readonly int experimentTimeout;
        private readonly int pullTimeout;

        public Application(
            ApiService apiService,
            ExperimenterDataService experimenterDataService)
        {
            this.apiService = apiService;
            this.experimenterDataService = experimenterDataService;
            this.currentDirectoryPath = Path.GetDirectoryName(Process.GetCurrentProcess().MainModule.FileName);
            this.experimentTimeout = (int)TimeSpan.Parse(ConfigurationManager.AppSettings.Get("ExperimentTimeout")).TotalMilliseconds;
            this.pullTimeout = (int)TimeSpan.Parse(ConfigurationManager.AppSettings.Get("PullTimeout")).TotalMilliseconds;
        }

        public void Run()
        {
            while (true)
            {
                logger.Info($"Waiting for pulling experiment from server...");
                Thread.Sleep(pullTimeout);
                try
                {
                    var model = GetExperimentModelFromServer();

                    if (model != null)
                    {
                        IList<Run> results = null;
                        try
                        {
                            var dataDirectory = PrepareExperimentEnvironment(model);

                            results = ExecuteExperiment(dataDirectory);

                            ClearExperimentEnvironment(dataDirectory);
                        }
                        catch (Exception ex)
                        {
                            logger.Error($"Experiment failed...");
                            logger.Error(ex);
                        }

                        SendExperimentResultsToServer(results, model);

                        logger.Info($"Experiment run completed");
                    }
                }
                catch (Exception ex)
                {
                    logger.Error($"Something went wrong...");
                    logger.Error(ex);
                }
            }
        }

        private ApiExperimentModel GetExperimentModelFromServer()
        {
            logger.Info("Getting new experiment from server...");
            var model = apiService.TakeExperimentForProcessing();
            if (model != null)
            {
                logger.Info($"Experiment {model.ExperimentName} [{model.ExperimentId}] recieved.");
            }
            else
            {
                logger.Info($"No new experiments.");
            }
            return model;
        }

        private DirectoryInfo PrepareExperimentEnvironment(ApiExperimentModel data)
        {
            string dataDirectoryName = DateTime.UtcNow.Ticks.ToString();
            logger.Info($"Creating experiment data folder: [{dataDirectoryName}].");
            var dataDirectory = Directory.CreateDirectory(Path.Combine(currentDirectoryPath, dataDirectoryName));

            logger.Info($"Creating data model xml.");
            experimenterDataService.WriteModelDataToFile(GetDataPath(dataDirectory), data);

            logger.Info($"Creating expscenario model xml.");
            experimenterDataService.WriteExperimentScenarioToFile(GetExpscenarioPath(dataDirectory), data);

            return dataDirectory;
        }

        private void ClearExperimentEnvironment(DirectoryInfo experimentDataDirectory)
        {
            logger.Info($"Deleting experiment data folder...");
            experimentDataDirectory.Delete(true);

            logger.Info($"Deleting logs...");
            string logFilePath = Path.Combine(currentDirectoryPath, "Log.log");
            if (File.Exists(logFilePath))
            {
                File.Delete(logFilePath);
            }
        }

        private IList<Run> ExecuteExperiment(DirectoryInfo experimentDataDirectory)
        {
            logger.Info($"Running experiment process...");
            Process process = new Process();
            process.StartInfo.WorkingDirectory = currentDirectoryPath;
            process.StartInfo.FileName = "experimenter.exe";
            process.StartInfo.Arguments = string.Format("enterprise3.exe {0} {1}", GetDataPath(experimentDataDirectory), GetExpscenarioPath(experimentDataDirectory));
            process.Start();

            var isCompleted = process.WaitForExit(experimentTimeout);

            if (isCompleted)
            {
                logger.Info($"Experiment process completed. Checking results...");

                var results = experimenterDataService.GetResultsFromFile(GetExpscenarioPath(experimentDataDirectory));
                if (results.Count > 0)
                {
                    logger.Info($"Experiment completed.");
                    return results;
                }
                else
                {
                    logger.Info($"Experiment failed.");
                    return null;
                }
            }
            else
            {
                logger.Info($"Timeout...experiment will be closed");
                var closed = process.CloseMainWindow();

                if (closed == false)
                {
                    process.Kill();
                }

                logger.Info($"Experiment process forced closed.");
                logger.Info($"Experiment failed.");
                return null;
            }
        }

        private void SendExperimentResultsToServer(IList<Run> results, ApiExperimentModel model)
        {
            if (results != null)
            {
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
                logger.Info($"Sending failed results to server...");
                apiService.SendExperimentResult(null, model.ExperimentId);
            }
        }

        private string GetDataPath(DirectoryInfo experimentDataDirectory)
        {
            return Path.Combine(currentDirectoryPath, experimentDataDirectory.Name, "data.xml");
        }

        private string GetExpscenarioPath(DirectoryInfo experimentDataDirectory)
        {
            return Path.Combine(currentDirectoryPath, experimentDataDirectory.Name, "expscenario.xml");
        }
    }
}
