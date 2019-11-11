using belsim2020.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace belsim2020.Services
{
    public class CurrentUserContext : ICurrentUserContext
    {
        private readonly IHttpContextAccessor httpContextAccessor;

        public CurrentUserContext(IHttpContextAccessor httpContextAccessor)
        {
            this.httpContextAccessor = httpContextAccessor;
            var context = httpContextAccessor.HttpContext.User.Claims;
        }


        public string UserId { get => Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value; }
        public IEnumerable<string> Roles { get => Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value); }
        public IEnumerable<Claim> Claims { get => httpContextAccessor.HttpContext.User.Claims; }
    }
}
