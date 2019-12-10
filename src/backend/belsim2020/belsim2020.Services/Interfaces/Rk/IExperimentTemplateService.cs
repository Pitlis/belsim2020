using belsim2020.Services.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace belsim2020.Services.Interfaces.Rk
{
    public interface IExperimentTemplateService
    {
        Task<Guid> CreateExperimentTemplate(string name, string description, Guid projectId);
        Task UpdateExperimentTemplate(RkExperimentTemplateModel model);
        Task DeleteExperimentTemplate(Guid experimentTemplateId);
        Task<RkExperimentTemplateModel> GetExperimentTemplate(Guid experimentTemplateId);
        Task<List<RkExperimentShortInfoModel>> GetExperimentTemplates(Guid projectId);
        Task UpdateProductList(Guid experimentTemplateId, IList<Guid> productIds);
        Task UpdateResourcesList(Guid experimentTemplateId, IList<Guid> resourceIds);
        Task<Guid> CreateExperiment(Guid experimentTemplateId);
    }
}
