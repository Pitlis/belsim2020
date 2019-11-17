using System;

namespace belsim2020.ViewModels
{
    public class CreateExperimentTemplateViewModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public Guid ProjectId { get; set; }
    }
}
