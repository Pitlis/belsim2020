using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace belsim2020.Entities
{
    [Table("RK_RkProductResourceInExperiment")]
    public class RkProductResourceInExperiment
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid RkProductResourceInExperimentId { get; set; }

        public Guid RkResourceInExperimentId { get; set; }
        public virtual RkResourceInExperiment ResourceInExperiment { get; set; }

        public Guid RkProductInExperimentId { get; set; }
        public virtual RkProductInExperiment RkProductInExperiment { get; set; }

        // Производство: Расход ресурсов (ед.рес./ед.прод.)
        public double ResourceConsumption { get; set; }
    }
}
