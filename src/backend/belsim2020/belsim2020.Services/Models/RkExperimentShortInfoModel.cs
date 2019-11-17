using System;

namespace belsim2020.Services.Models
{
    public class RkExperimentShortInfoModel
    {
        public Guid RkExperimentTemplateId { get; set; }

        public string OwnerId { get; set; }
        public string OwnerName { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
    }
}
