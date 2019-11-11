using System;

namespace belsim2020.ViewModels
{
    public class AddUserToProjectViewModel
    {
        public string UserId { get; set; }
        public Guid ProjectId { get; set; }
        public bool IsOwner { get; set; }
    }
}
