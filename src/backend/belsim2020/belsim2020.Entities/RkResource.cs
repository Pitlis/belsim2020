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
	}
}
