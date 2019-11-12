using belsim2020.Entities;
using System;
using System.Collections.Generic;

namespace belsim2020.ViewModels
{
    public class ProjectInfoViewModel
    {
        public Guid ProjectId { get; set; }

        public string ProjectName { get; set; }

        public string OrganizationName { get; set; }

        public string Comments { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }

        public RkExperimentType ProjectType { get; set; }
    }
}
