using belsim2020.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace belsim2020.Services
{
	public class CurrentUserContext : ICurrentUserContext
	{
		private readonly IHttpContextAccessor httpContextAccessor;

		public CurrentUserContext(IHttpContextAccessor httpContextAccessor)
		{
			this.httpContextAccessor = httpContextAccessor;
			var context = httpContextAccessor.HttpContext.User;
		}

		public string UserId { get => null; }
		public IList<string> Roles { get => null; }
		public IList<string> Claims { get => null; }
	}
}
