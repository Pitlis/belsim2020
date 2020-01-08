using System.Collections.Generic;
using System.Threading.Tasks;
using belsim2020.Entities;
using belsim2020.Services.Models;
using Microsoft.AspNetCore.Identity;

namespace belsim2020.Services.Interfaces
{
    public interface IUserService
    {
        Task<CreateUserResultModel> CreateUser(string email, string publicName, string organizationName, string comments, string password);
        Task<IdentityResult> DeleteUser(string userId);
        Task<IdentityResult> ChangePassword(string userId, string updatedPassword);
        Task<UserViewModel> GetUser(string userId);
        Task<IList<UserViewModel>> GetUsers();
        Task SetRoles(string userId, IList<string> roles);
    }
}
