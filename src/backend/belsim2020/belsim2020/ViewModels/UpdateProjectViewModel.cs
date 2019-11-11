using System;

namespace belsim2020.ViewModels
{
    public class UpdateProjectViewModel
    {
        public Guid ProjectId { get; set; }
        public string Name { get; set; }
        public string Organization { get; set; }
        public string Comments { get; set; }
    }
}
