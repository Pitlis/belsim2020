using belsim2020.Entities;
using belsim2020.Entities.Constants;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;

namespace belsim2020.Database
{
    public class Belsim2020DbContext : IdentityDbContext
    {
        public DbSet<Project> Projects { get; set; }
        public DbSet<UserProject> UserProjects { get; set; }
        public DbSet<RkResource> RkResources { get; set; }
        public DbSet<RkProduct> RkProducts { get; set; }
        public DbSet<RkResourceInExperiment> RkResourcesInExperiment { get; set; }
        public DbSet<RkProductInExperiment> RkProductsInExperiment { get; set; }
        public DbSet<RkExperimentTemplate> RkExperimentTemplates { get; set; }
        public DbSet<RkAccount> RkAccounts { get; set; }
        public DbSet<RkAccountInExperiment> RkAccountsInExperiment { get; set; }
        public DbSet<RkProductResourceInExperiment> RkProductResourceInExperiment { get; set; }
        public DbSet<RkProductShipmentInExperiment> RkProductShipmentInExperiment { get; set; }

        public Belsim2020DbContext(DbContextOptions<Belsim2020DbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>(b =>
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

            builder.Entity<IdentityRole>().HasData(new IdentityRole { Name = AuthConstants.Roles.Admin, NormalizedName = AuthConstants.Roles.Admin.ToUpper(), Id = "ca7e6b7f-ddfc-4511-a9bf-cca8ad67740b", ConcurrencyStamp = "34422411-bc34-403c-9ab7-7b38419aa099" });
            builder.Entity<IdentityRole>().HasData(new IdentityRole { Name = AuthConstants.Roles.User, NormalizedName = AuthConstants.Roles.User.ToUpper(), Id = "6b3f8340-34a4-44a0-9002-dba91a26509f", ConcurrencyStamp = "a26a99f6-cbe2-4dea-8bd8-c65def948f1b" });

            builder.Entity<UserProject>()
                .HasKey(pt => new { pt.ProjectId, pt.UserId });

            builder.Entity<UserProject>()
                .HasOne(up => up.Project)
                .WithMany(p => p.Users)
                .HasForeignKey(pt => pt.ProjectId);

            builder.Entity<UserProject>()
                .HasOne(pt => pt.User)
                .WithMany(t => t.Projects)
                .HasForeignKey(pt => pt.UserId);

            builder.Entity<RkAccount>().HasData(new RkAccount() { Name = "_Счет 1", RkAccountId = Guid.Parse("eaacc9f3-a658-4218-ac77-3aefcf278c34") });
            builder.Entity<RkAccount>().HasData(new RkAccount() { Name = "_Счет 2", RkAccountId = Guid.Parse("d6d2e616-39b5-4b16-8fdb-15e28d050f6f") });
        }
    }
}
