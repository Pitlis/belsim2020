using belsim2020.Entities;
using System;

namespace belsim2020.Services.Models
{
    public class ExperimentShortInfoModel
    {
        public Guid ExperimentId { get; set; }
        public string Name { get; set; }

        public string OwnerName { get; set; }

        public string ExperimentTemplateName { get; set; }
        public Guid ExperimentTemplateId { get; set; }

        public DateTime CreatedAt { get; set; }
        public ExperimentStatus Status { get; set; }
        public DateTime StatusChangedAt { get; set; }
    }
}
