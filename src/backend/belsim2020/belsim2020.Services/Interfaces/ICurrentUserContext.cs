using System.Collections.Generic;
using System.Security.Claims;

namespace belsim2020.Services.Interfaces
{
    public interface ICurrentUserContext
    {
        string UserId { get; }

        IEnumerable<string> Roles { get; }

        IEnumerable<Claim> Claims { get; }
    }
}
