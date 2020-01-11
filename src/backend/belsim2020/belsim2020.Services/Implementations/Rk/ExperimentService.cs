using AutoMapper;
using belsim2020.Database;
using belsim2020.Entities;
using belsim2020.Services.Configuration;
using belsim2020.Services.Extensions;
using belsim2020.Services.Interfaces;
using belsim2020.Services.Interfaces.Rk;
using belsim2020.Services.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
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
        private readonly ICurrentUserContext userContext;
        private readonly IMapper mapper;
        private readonly ExperimentSettings options;

        public ExperimentService(
            Belsim2020DbContext dbContext,
            ILogger<ExperimentService> logger,
            IMapper mapper,
            ICurrentUserContext userContext,
            IOptions<ExperimentSettings> settings)
        {
            this.dbContext = dbContext;
            this.logger = logger;
            this.mapper = mapper;
            this.userContext = userContext;
            this.options = settings.Value;
        }

        public async Task<IList<ExperimentShortInfoModel>> GetProjectExperimentsList(Guid projectId)
        {
            await VerifyAccessToProject(projectId);

            return await dbContext.RkExperiments
                .Where(e => e.ExperimentTemplate.ProjectId == projectId)
                .Select(e => new ExperimentShortInfoModel()
                {
                    ExperimentId = e.RkExperimentId,
                    Name = e.Name,
                    OwnerName = e.CreatedBy.PublicName,
                    ExperimentTemplateName = e.ExperimentTemplate.Name,
                    ExperimentTemplateId = e.ExperimentTemplateId,
                    CreatedAt = e.CreatedAt,
                    Status = e.Status,
                    StatusChangedAt = e.StatusChangedAt
                })
                .ToListAsync();
        }

        public async Task<RkExperiment> GetExperiment(Guid experimentId)
        {
            var experiment = await dbContext.RkExperiments
                .Where(e => e.RkExperimentId == experimentId)
                .Include(e => e.ExperimentTemplate)
                .Include(e => e.CreatedBy)
                .FirstOrDefaultAsync();

            if (experiment == null)
            {
                throw new ApplicationException($"Experiment [{experimentId}] does not exists");
            }

            await VerifyAccessToProject(experiment.ExperimentTemplate.ProjectId);

            return experiment;
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

        public async Task SetExperimentResult(Guid experimentId, string resultJson)
        {
            var experiment = await dbContext.RkExperiments.FirstOrDefaultAsync(e => e.RkExperimentId == experimentId);
            if (experiment == null)
            {
                throw new ApplicationException($"Experiment [{experimentId}] does not exists");
            }

            if (experiment.Status != ExperimentStatus.InProgress)
            {
                throw new ApplicationException($"Cannot set experiment results: experiment [{experimentId}] is not in progress - it's in status [{experiment.Status}]");
            }

            if (resultJson == null)
            {
                experiment.Status = ExperimentStatus.Failed;
                experiment.StatusChangedAt = DateTime.UtcNow;
            }
            else
            {
                experiment.ResultData = resultJson;
                experiment.Status = ExperimentStatus.Completed;
                experiment.StatusChangedAt = DateTime.UtcNow;
            }

            await dbContext.SaveChangesAsync();
        }

        public async Task ExpireExperiments()
        {
            var expirationTime = DateTime.UtcNow.Subtract(options.ProcessingTimeout);
            var expiredExperiments = await dbContext.RkExperiments
                .Where(e => e.Status == ExperimentStatus.InProgress && e.StatusChangedAt < expirationTime)
                .ToListAsync();

            foreach (var experiment in expiredExperiments)
            {
                experiment.Status = ExperimentStatus.Failed;
                experiment.StatusChangedAt = DateTime.UtcNow;
            }

            await dbContext.SaveChangesAsync();
        }


        #region Helpers

        private async Task VerifyAccessToProject(Guid projectId)
        {
            var project = await dbContext.Projects
                .Include(p => p.Users)
                .FirstOrDefaultAsync(p => p.ProjectId == projectId);

            if (project == null)
            {
                throw new ApplicationException($"Project [{projectId}] does not exist");
            }

            if (!project.Users.Select(u => u.UserId).Contains(userContext.UserId) && !userContext.IsAdmin())
            {
                throw new ApplicationException($"User[{userContext.UserId}] does not have access to project [{projectId}]");
            }
        }

        #endregion
    }
}
