﻿using belsim2020.Entities;
using belsim2020.Services.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace belsim2020.Services.Interfaces.Rk
{
    public interface IExperimentService
    {
        Task<RkExperiment> GetLastUnprocessedExperiment();
        Task MarkExperimentAsProcessed(Guid experimentId);
        Task SetExperimentResult(Guid experimentId, string resultJson);
        Task<IList<ExperimentShortInfoModel>> GetProjectExperimentsList(Guid projectId);
        Task<RkExperiment> GetExperiment(Guid experimentId);
        Task ExpireExperiments();
    }
}
