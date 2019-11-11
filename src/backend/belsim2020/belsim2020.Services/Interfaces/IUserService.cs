using System.Threading.Tasks;
using belsim2020.Entities;
using belsim2020.Services.Models;
using Microsoft.AspNetCore.Identity;

namespace belsim2020.Services.Interfaces
{
    public interface IUserService
    {
        Task<CreateUserResult> CreateUser(string email, string publicName, string organizationName, string comments, string password);
        Task<IdentityResult> DeleteUser(string userId);
        Task<IdentityResult> ChangePassword(string userId, string updatedPassword);
        Task<User> GetUser(string userId);
    }
}
