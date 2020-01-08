using belsim2020.Entities;
using System.Collections.Generic;

namespace belsim2020.Services.Models
{
    public class UserViewModel: User
    {
        public IList<string> Roles { get; set; }
    }
}
