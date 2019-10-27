using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace belsim2020.Entities
{
	[Table("UserProject")]
	public class UserProject
	{
		public string UserId { get; set; }
		public virtual User User { get; set; }

		public Guid ProjectId { get; set; }
		public virtual Project Project { get; set; }
	}
}
