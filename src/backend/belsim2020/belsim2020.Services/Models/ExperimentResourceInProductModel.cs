using System;

namespace belsim2020.Services.Models
{
    public class ExperimentResourceInProductModel
    {
        public Guid RkProductResourceInExperimentId { get; set; }

        public Guid RkResourceInExperimentId { get; set; }

        // Производство: Расход ресурсов (ед.рес./ед.прод.)
        public double ResourceConsumption { get; set; }
    }
}
