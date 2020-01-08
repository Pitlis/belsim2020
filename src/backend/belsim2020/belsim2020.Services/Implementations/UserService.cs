using AutoMapper;
using belsim2020.Database;
using belsim2020.Entities;
using belsim2020.Entities.Constants;
using belsim2020.Services.Interfaces;
using belsim2020.Services.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static belsim2020.Entities.Constants.AuthConstants;

namespace belsim2020.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly Belsim2020DbContext dbContext;
        private readonly UserManager<User> userManager;
        private readonly ILogger<UserService> logger;
        private readonly IMapper mapper;

        public UserService(
            Belsim2020DbContext dbContext,
            UserManager<User> userManager,
            ILogger<UserService> logger,
            IMapper mapper)
        {
            this.dbContext = dbContext;
            this.userManager = userManager;
            this.logger = logger;
            this.mapper = mapper;
        }

        public async Task<CreateUserResultModel> CreateUser(string email, string publicName, string organizationName, string comments, string password)
        {
            var user = new User
            {
                UserName = email,
                Email = email,
                PublicName = publicName,
                OrganizationName = organizationName,
                Comments = comments
            };

            var result = await userManager.CreateAsync(user, password);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    logger.LogError($"User creation failed: [{error.Code}] [{error.Description}]");
                }
            }
            else
            {
                await userManager.AddToRolesAsync(user, new List<string>() { AuthConstants.Roles.User });
            }

            return new CreateUserResultModel()
            {
                IdentityResult = result,
                UserId = result.Succeeded ? user.Id : null
            };
        }

        public async Task<IdentityResult> ChangePassword(string userId, string updatedPassword)
        {
            var user = await userManager.FindByIdAsync(userId);
            string code = await userManager.GeneratePasswordResetTokenAsync(user);
            var result = await userManager.ResetPasswordAsync(user, code, updatedPassword);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    logger.LogError($"User creation failed: [{error.Code}] [{error.Description}]");
                }
            }

            return result;
        }

        public async Task<IdentityResult> DeleteUser(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);
            var result = await userManager.DeleteAsync(user);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    logger.LogError($"User creation failed: [{error.Code}] [{error.Description}]");
                }
            }

            return result;
        }

        public async Task<UserViewModel> GetUser(string userId)
        {
            // TODO: use join?
            var user = await userManager.FindByIdAsync(userId);
            var userModel = mapper.Map<UserViewModel>(user);
            userModel.Roles = await userManager.GetRolesAsync(user);

            return userModel;
        }

        public async Task<IList<UserViewModel>> GetUsers()
        {
            var result = new List<UserViewModel>();
            // TODO: use join
            var users = await dbContext.Users.ToListAsync();
            foreach (var user in users)
            {
                var userModel = mapper.Map<UserViewModel>(user);
                userModel.Roles = await userManager.GetRolesAsync((User)user);
                result.Add(userModel);
            }
            return result;
        }

        public async Task SetRoles(string userId, IList<string> roles)
        {
            var user = await userManager.FindByIdAsync(userId);

            if (user == null)
            {
                throw new ApplicationException($"User [{userId}] does not exist");
            }

            var allowedRolesList = new List<string>() { Roles.Admin, Roles.User };
            foreach (var role in roles)
            {
                if (!allowedRolesList.Contains(role))
                {
                    throw new ApplicationException($"Role [{role}] is not allowed");
                }
            }

            var rolesToRemove = new List<string>();
            var existsRoles = await userManager.GetRolesAsync(user);
            foreach (var existsRole in existsRoles)
            {
                if (!roles.Contains(existsRole))
                {
                    rolesToRemove.Add(existsRole);
                }
            }

            var rolesToAdd = new List<string>();
            foreach (var role in roles)
            {
                if (!existsRoles.Contains(role))
                {
                    rolesToAdd.Add(role);
                }
            }

            await userManager.RemoveFromRolesAsync(user, rolesToRemove);
            await userManager.AddToRolesAsync(user, rolesToAdd);
        }
    }
}
