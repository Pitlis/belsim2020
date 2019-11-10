using System.ComponentModel.DataAnnotations;

namespace belsim2020.ViewModels
{
	public class CreateUserViewModel
	{
		[Required]
		[EmailAddress]
		public string Email { get; set; }

		[Required]
		public string PublicName { get; set; }

		[Required]
		[StringLength(100, MinimumLength = 6)]
		[DataType(DataType.Password)]
		public string Password { get; set; }

		public string OrganizationName { get; set; }

		public string Comments { get; set; }
	}
}
