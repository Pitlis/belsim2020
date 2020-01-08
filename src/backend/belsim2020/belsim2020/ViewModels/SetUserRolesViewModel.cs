using System.Collections.Generic;

namespace belsim2020.ViewModels
{
    public class SetUserRolesViewModel
    {
        public string UserId { get; set; }
        public IList<string> Roles { get; set; }
    }
}
