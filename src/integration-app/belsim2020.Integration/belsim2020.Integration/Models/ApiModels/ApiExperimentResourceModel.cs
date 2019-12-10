using System;

namespace belsim2020.Integration.Models.ApiModels
{
    public class ApiExperimentResourceModel
    {
        public Guid RkResourceInExperimentId { get; set; }

        public Guid ResourceId { get; set; }
        public Guid ExperimentTemplateId { get; set; }

        // Запасы: Материальные ресурсы (ед.)
        public double StoredResourcesCount { get; set; }

        // Запасы: Цена материальных ресурсов (руб./ед.)
        public decimal StoredResourcePrice { get; set; }

        // Снабжение: Цены ресурсов (руб./ед.)
        public decimal Price { get; set; }
    }
}
