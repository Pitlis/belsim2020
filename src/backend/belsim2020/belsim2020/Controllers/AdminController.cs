﻿using belsim2020.Configuration;
using belsim2020.Entities;
using belsim2020.Entities.Constants;
using belsim2020.Services.Interfaces;
using belsim2020.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace belsim2020.Controllers
{
    [Route("api/admin")]
    [ApiController]
    [Authorize(Roles = "admin")]
    public class AdminController : Controller
    {
        private readonly IUserService userService;
        private readonly UserManager<User> userManager;
        private readonly AdminSettings adminSettings;

        public AdminController(
            IUserService userService,
            UserManager<User> userManager,
            IOptions<AdminSettings> adminSettings)
        {
            this.userService = userService;
            this.userManager = userManager;
            this.adminSettings = adminSettings.Value;
        }

        [HttpPost("create-user")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserViewModel model)
        {
            var result = await userService.CreateUser(
                model.Email,
                model.PublicName,
                model.OrganizationName,
                model.Comments,
                model.Password
            );

            if (result.IdentityResult.Succeeded)
            {
                return new OkObjectResult(result.UserId);
            }
            else
            {
                return new BadRequestObjectResult(result.IdentityResult.Errors);
            }
        }

        [HttpGet("get-user/{userId}")]
        public async Task<IActionResult> GetUser(string userId)
        {
            var user = await userService.GetUser(userId);
            var result = new UserViewModel()
            {
                Email = user.Email,
                PublicName = user.PublicName,
                Comments = user.Comments,
                Organization = user.OrganizationName
            };

            return new OkObjectResult(result);
        }

        [HttpPost("update-password")]
        public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordByAdminViewModel model)
        {
            var result = await userService.ChangePassword(model.UserId, model.Password);

            if (result.Succeeded)
            {
                return new OkResult();
            }
            else
            {
                return new BadRequestObjectResult(result.Errors);
            }
        }

        [HttpPost("delete-user")]
        public async Task<IActionResult> DeleteUser([FromBody] string userId)
        {
            var result = await userService.DeleteUser(userId);

            if (result.Succeeded)
            {
                return new OkResult();
            }
            else
            {
                return new BadRequestObjectResult(result.Errors);
            }
        }

        [HttpPost("init-system")]
        [AllowAnonymous]
        public async Task<IActionResult> InitSystem()
        {
            IdentityResult result = null;

            if (userManager.FindByNameAsync(adminSettings.Email).Result == null)
            {
                var admin = new User();
                admin.UserName = adminSettings.Email;
                admin.Email = adminSettings.Email;

                result = userManager.CreateAsync(admin, adminSettings.InitPassword).Result;

                result = userManager.AddToRolesAsync(admin, new string[]
                {
                    AuthConstants.Roles.User,
                    AuthConstants.Roles.Admin
                }).Result;
            }

            return new OkResult();
        }
    }
}