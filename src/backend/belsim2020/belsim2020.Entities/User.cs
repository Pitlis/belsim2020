using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace belsim2020.Entities
{
	public class User : IdentityUser
	{
		public string OrganizationName { get; set; }
		public string Comments { get; set; }

		public string PublicName { get; set; }

		public virtual ICollection<UserProject> Projects { get; set; }
	}
}
