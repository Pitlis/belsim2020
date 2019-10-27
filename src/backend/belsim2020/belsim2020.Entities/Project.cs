using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace belsim2020.Entities
{
	[Table("Projects")]
	public class Project
	{
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public Guid ProjectId { get; set; }

		public string ProjectName { get; set; }

		public DateTime CreatedAt { get; set; }
		public DateTime ModifiedAt { get; set; }

		public RkExperimentType ProjectType { get; set; }

		public virtual ICollection<UserProject> Users { get; set; }
	}
}
