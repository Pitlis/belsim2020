using AutoMapper;
using belsim2020.Database;
using belsim2020.Entities;
using belsim2020.Services.Extensions;
using belsim2020.Services.Interfaces;
using belsim2020.Services.Interfaces.Rk;
using belsim2020.Services.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace belsim2020.Services.Implementations.Rk
{
    public class ExperimentService : IExperimentService
    {
        private readonly Belsim2020DbContext dbContext;
        private readonly ILogger<ExperimentService> logger;
        private readonly IMapper mapper;

        public ExperimentService(
            Belsim2020DbContext dbContext,
            ILogger<ExperimentService> logger,
            IMapper mapper)
        {
            this.dbContext = dbContext;
            this.logger = logger;
            this.mapper = mapper;
        }

        public async Task<RkExperiment> GetLastUnprocessedExperiment()
        {
            return await dbContext.RkExperiments
                .Where(e => e.Status == ExperimentStatus.Created)
                .OrderBy(e => e.CreatedAt)
                .FirstOrDefaultAsync();
        }

        public async Task MarkExperimentAsProcessed(Guid experimentId)
        {
            var experiment = await dbContext.RkExperiments.FirstOrDefaultAsync(e => e.RkExperimentId == experimentId);
            if (experiment == null)
            {
                throw new ApplicationException($"Experiment [{experimentId}] does not exists");
            }

            if (experiment.Status != ExperimentStatus.Created)
            {
                throw new ApplicationException($"Experiment [{experimentId}] cannot be marked as processed - it's in status [{experiment.Status}]");
            }

            experiment.Status = ExperimentStatus.InProgress;
            experiment.StatusChangedAt = DateTime.UtcNow;

            await dbContext.SaveChangesAsync();
        }
    }
}
