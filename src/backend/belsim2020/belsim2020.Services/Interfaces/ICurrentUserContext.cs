using System.Collections.Generic;

namespace belsim2020.Services.Interfaces
{
    public interface ICurrentUserContext
    {
        string UserId { get; }

        IList<string> Roles { get; }

        IList<string> Claims { get; }
    }
}
