using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace belsim2020.Middlewares
{
	public class CustomExceptionMiddleware
	{
		private readonly RequestDelegate next;
		private readonly ILogger<CustomExceptionMiddleware> logger;

		public CustomExceptionMiddleware(
			RequestDelegate next,
			ILogger<CustomExceptionMiddleware> logger)
		{
			this.next = next;
			this.logger = logger;
		}

		public async Task Invoke(HttpContext context)
		{
			try
			{
				await next.Invoke(context);
			}
			catch (Exception ex)
			{
				logger.LogError(ex, "Unproccessed error");
				throw;
			}
		}
	}
}
