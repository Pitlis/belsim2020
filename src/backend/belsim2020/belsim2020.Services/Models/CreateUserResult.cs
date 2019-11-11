using Microsoft.AspNetCore.Identity;

namespace belsim2020.Services.Models
{
    public class CreateUserResult
    {
        public IdentityResult IdentityResult { get; set; }
        public string UserId { get; set; }
    }
}
