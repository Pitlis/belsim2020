using belsim2020.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace belsim2020.Services.Interfaces.Rk
{
    public interface IResourceService
    {
        Task CreateResource(RkResource resource);
        Task DeleteResource(Guid resourceId);
        Task<IList<RkResource>> GetAllResources(Guid projectId);
    }
}
