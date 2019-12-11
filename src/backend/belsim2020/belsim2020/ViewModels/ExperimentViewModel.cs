using belsim2020.Entities;
using Newtonsoft.Json.Linq;
using System;

namespace belsim2020.ViewModels
{
    public class ExperimentViewModel
    {
        public Guid RkExperimentId { get; set; }

        public UserNameViewModel CreatedBy { get; set; }

        public Guid ExperimentTemplateId { get; set; }
        public string ExperimentTemplateName { get; set; }

        public DateTime CreatedAt { get; set; }

        public JObject ExperimentData { get; set; }
        public JArray ResultData { get; set; }

        public ExperimentStatus Status { get; set; }
        public DateTime StatusChangedAt { get; set; }
    }
}
