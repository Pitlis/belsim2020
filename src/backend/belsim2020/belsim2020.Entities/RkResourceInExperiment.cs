using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace belsim2020.Entities
{
    [Table("RK_ResourcesInExperiment")]
    public class RkResourceInExperiment
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid RkResourceInExperimentId { get; set; }

        public Guid ResourceId { get; set; }
        public virtual RkResource Resource { get; set; }

        public Guid ExperimentTemplateId { get; set; }
        public virtual RkExperimentTemplate ExperimentTemplate { get; set; }

        // Запасы: Материальные ресурсы (ед.)
        public double StoredResourcesCount { get; set; }

        // Запасы: Цена материальных ресурсов (руб./ед.)
        public decimal StoredResourcePrice { get; set; }

        // Снабжение: Цены ресурсов (руб./ед.)
        public decimal Price { get; set; }
    }
}
