using System.Collections.Generic;

namespace belsim2020.ViewModels
{
    public class ProjectInfoWithUsersViewModel : ProjectInfoViewModel
    {
        public IList<UserNameViewModel> Owners { get; set; }

        public IList<UserNameViewModel> AssignedUsers { get; set; }
    }
}
