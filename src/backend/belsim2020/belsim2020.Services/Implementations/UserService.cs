using belsim2020.Database;
using belsim2020.Entities;
using belsim2020.Entities.Constants;
using belsim2020.Services.Interfaces;
using belsim2020.Services.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace belsim2020.Services.Implementations
{
	public class UserService : IUserService
	{
		private readonly Belsim2020DbContext dbContext;
		private readonly UserManager<User> userManager;
		private readonly ILogger<UserService> logger;

		public UserService(
			Belsim2020DbContext dbContext,
			UserManager<User> userManager,
			ILogger<UserService> logger)
		{
			this.dbContext = dbContext;
			this.userManager = userManager;
			this.logger = logger;
		}

		public async Task<CreateUserResult> CreateUser(string email, string publicName, string organizationName, string comments, string password)
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

			return new CreateUserResult()
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

		public async Task<User> GetUser(string userId)
		{
			return await userManager.FindByIdAsync(userId);
		}
	}
}
