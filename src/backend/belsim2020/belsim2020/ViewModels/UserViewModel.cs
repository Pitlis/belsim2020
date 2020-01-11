using System.Collections.Generic;

namespace belsim2020.ViewModels
{
    public class UserViewModel
    {
        public string Id { get; set; }

        public string Email { get; set; }

        public string PublicName { get; set; }

        public string OrganizationName { get; set; }

        public string Comments { get; set; }

        public IList<string> Roles { get; set; }
    }
}
