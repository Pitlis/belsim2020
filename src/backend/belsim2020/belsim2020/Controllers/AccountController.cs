﻿using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using belsim2020.Entities;
using belsim2020.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace belsim2020.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> userManager;
        private readonly ILogger<AccountController> logger;
        private readonly SignInManager<User> signInManager;

        public AccountController(
            UserManager<User> userManager,
            ILogger<AccountController> logger,
            SignInManager<User> signInManager)
        {
            this.userManager = userManager;
            this.logger = logger;
            this.signInManager = signInManager;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            if (User.Identity.IsAuthenticated)
            {
                return new OkResult();
            }

            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult(ModelState);
            }

            User user = await userManager.FindByEmailAsync(model.Email);

            if (user == null)
            {
                ModelState.AddModelError("Errors", "INVALID_EMAIL_OR_PASSWORD");
                return new BadRequestObjectResult(ModelState);
            }

            if (await userManager.IsLockedOutAsync(user))
            {
                ModelState.AddModelError("Errors", "LOCKED");
                return new BadRequestObjectResult(ModelState);
            }

            if (await userManager.CheckPasswordAsync(user, model.Password) == false)
            {
                user.AccessFailedCount++;
                var result = await userManager.UpdateAsync(user);

                if (result.Errors != null && result.Errors.Any())
                {
                    foreach (var error in result.Errors)
                    {
                        logger.LogError($"User saving error [UserName: {user.UserName}]: [{error.Code}] [{error.Description}]");
                    }
                }

                ModelState.AddModelError("Errors", "INVALID_EMAIL_OR_PASSWORD");
                return new BadRequestObjectResult(ModelState);
            }

            var signInResult = await signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, true);

            if (signInResult.Succeeded)
            {
                logger.LogDebug("User [{0}] login", model.Email);
                return new OkResult();
            }
            else
            {
                logger.LogError($"Something in login went wrong... [{signInResult.ToString()}]");
                return new BadRequestResult();
            }
        }

        [HttpGet("refresh-session")]
        [Authorize]
        public IActionResult RefreshSession()
        {
            return new OkResult();
        }

        [HttpGet("get-roles")]
        [Authorize]
        public IActionResult GetRoles()
        {
            var roles = User.Claims
                .Where(c => c.Type == ClaimTypes.Role)
                .Select(c => c.Value)
                .ToList();
            return new OkObjectResult(roles);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await signInManager.SignOutAsync();

            return new OkResult();
        }
    }
}