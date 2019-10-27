using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace belsim2020.Entities
{
	[Table("RK_Products")]
	public class RkProduct
	{
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public Guid RkProductId { get; set; }

		public string Name { get; set; }
	}
}
