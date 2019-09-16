using belsim2020.Database.Constants;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace belsim2020.Database
{
	public class Belsim2020DbContext : IdentityDbContext
	{
		public Belsim2020DbContext(DbContextOptions<Belsim2020DbContext> options) : base(options) { }

		protected override void OnModelCreating(ModelBuilder builder)
		{
			base.OnModelCreating(builder);

			builder.Entity<IdentityUser>(b =>
			{
				b.Property(u => u.Id)
					.HasMaxLength(450);
			});

			builder.Entity<IdentityRole>()
				.Property(r => r.Id)
				.HasMaxLength(450);

			builder.Entity<IdentityUserLogin<string>>()
				.Property(l => l.LoginProvider)
				.HasMaxLength(450);

			builder.Entity<IdentityUserLogin<string>>()
				.Property(l => l.ProviderKey)
				.HasMaxLength(450);

			builder.Entity<IdentityUserToken<string>>()
				.Property(t => t.LoginProvider)
				.HasMaxLength(450);

			builder.Entity<IdentityUserToken<string>>()
				.Property(t => t.Name)
				.HasMaxLength(450);

			builder.Entity<IdentityRole>().HasData(new IdentityRole { Name = AuthConstants.Roles.Admin, NormalizedName = AuthConstants.Roles.Admin.ToUpper() });
			builder.Entity<IdentityRole>().HasData(new IdentityRole { Name = AuthConstants.Roles.User, NormalizedName = AuthConstants.Roles.User.ToUpper() });
		}
	}
}
