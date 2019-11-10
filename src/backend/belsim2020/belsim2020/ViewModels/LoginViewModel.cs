using System.ComponentModel.DataAnnotations;

namespace belsim2020.ViewModels
{
	public class LoginViewModel
	{
		[Required]
		[EmailAddress]
		public string Email { get; set; }

		[Required]
		public string Password { get; set; }
		
		public bool RememberMe { get; set; }
	}
}
