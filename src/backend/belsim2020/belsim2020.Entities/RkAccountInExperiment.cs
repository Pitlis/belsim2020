using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace belsim2020.Entities
{
    [Table("RK_RkAccountsInExperiment")]
    public class RkAccountInExperiment
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid RkAccountInExperimentId { get; set; }

        public Guid AccountId { get; set; }
        public virtual RkAccount Account { get; set; }

        public Guid ExperimentTemplateId { get; set; }
        public virtual RkExperimentTemplate ExperimentTemplate { get; set; }

        public decimal Value { get; set; }
    }
}
