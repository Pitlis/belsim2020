using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace belsim2020.Entities
{
    [Table("RK_Resources")]
    public class RkResource
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid RkResourceId { get; set; }

        public string Name { get; set; }
        public string NormalizedName { get; set; }

        public Guid ProjectId { get; set; }
        public virtual Project Project { get; set; }
    }
}
