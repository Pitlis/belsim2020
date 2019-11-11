using belsim2020.Entities.Constants;
using belsim2020.Services.Interfaces;
using System;
using System.Linq;

namespace belsim2020.Services.Extensions
{
    public static class UserContextExtensions
    {
        public static bool IsAdmin(this ICurrentUserContext context)
        {
            return context.Roles.Contains(AuthConstants.Roles.Admin);
        }
    }
}
