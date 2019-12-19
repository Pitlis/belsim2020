using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace belsim2020.Entities
{
    [Table("RK_Experiments")]
    public class RkExperiment
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid RkExperimentId { get; set; }

        public Guid ExperimentTemplateId { get; set; }
        public virtual RkExperimentTemplate ExperimentTemplate { get; set; }

        public DateTime CreatedAt { get; set; }

        public string CreatedById { get; set; }
        public virtual User CreatedBy { get; set; }

        public string ExperimentData { get; set; }
        public string ResultData { get; set; }

        public ExperimentStatus Status { get; set; }
        public DateTime StatusChangedAt { get; set; }

        public string Name { get; set; }
    }
}
