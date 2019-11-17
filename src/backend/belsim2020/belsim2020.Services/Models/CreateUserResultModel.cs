using Microsoft.AspNetCore.Identity;

namespace belsim2020.Services.Models
{
    public class CreateUserResultModel
    {
        public IdentityResult IdentityResult { get; set; }
        public string UserId { get; set; }
    }
}
