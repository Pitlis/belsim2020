using System;

namespace belsim2020.Integration.Models.ApiModels
{
    public class ApiExperimentResourceInProductModel
    {
        public Guid RkProductResourceInExperimentId { get; set; }

        public Guid RkResourceInExperimentId { get; set; }

        // Производство: Расход ресурсов (ед.рес./ед.прод.)
        public double ResourceConsumption { get; set; }
    }
}
