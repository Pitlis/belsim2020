using belsim2020.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace belsim2020.Services.Interfaces
{
    public interface IProjectService
    {
        Task<Guid> CreateProject(string name, string organization, string comments);
        Task UpdateProject(Project project);
        Task DeleteProject(Guid projectId);
        Task AddUserToProject(Guid projectId, string userId, bool isOwner = false);
        Task DeleteUserFromProject(Guid projectId, string userId);
        Task<Project> GetProjectInfo(Guid projectId);
        Task<IList<Project>> GetAvailableProjectsList(string userId);
    }
}
