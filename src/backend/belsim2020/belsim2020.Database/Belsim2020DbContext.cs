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
        public DbSet<RkExperiment> RkExperiments { get; set; }

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

            builder.Entity<RkAccount>().HasData(new RkAccount() { Name = "_Счёт 10: Начальное значение(отн.ед.)", RkAccountId = Guid.Parse("eaacc9f3-a658-4218-ac77-3aefcf278c3d") });
            builder.Entity<RkAccount>().HasData(new RkAccount() { Name = "_Счёт 18: Начальное значение(отн.ед.)", RkAccountId = Guid.Parse("d6d2e616-39b5-4b16-8fdb-15e28d050f62") });
            builder.Entity<RkAccount>().HasData(new RkAccount() { Name = "_Счёт 20: Начальное значение(отн.ед.)", RkAccountId = Guid.Parse("d6d2e616-39b5-4b16-8fdb-15e28d050f63") });
            builder.Entity<RkAccount>().HasData(new RkAccount() { Name = "_Счёт 40: Начальное значение(отн.ед.)", RkAccountId = Guid.Parse("d6d2e616-39b5-4b16-8fdb-15e28d050f64") });
            builder.Entity<RkAccount>().HasData(new RkAccount() { Name = "_Счёт 43: Начальное значение(отн.ед.)", RkAccountId = Guid.Parse("d6d2e616-39b5-4b16-8fdb-15e28d050f65") });
            builder.Entity<RkAccount>().HasData(new RkAccount() { Name = "_Счёт 50: Начальное значение(отн.ед.)", RkAccountId = Guid.Parse("d6d2e616-39b5-4b16-8fdb-15e28d050f66") });
            builder.Entity<RkAccount>().HasData(new RkAccount() { Name = "_Счёт 51: Начальное значение(отн.ед.)", RkAccountId = Guid.Parse("d6d2e616-39b5-4b16-8fdb-15e28d050f67") });
            builder.Entity<RkAccount>().HasData(new RkAccount() { Name = "_Счёт 60: Начальное значение(отн.ед.)", RkAccountId = Guid.Parse("d6d2e616-39b5-4b16-8fdb-15e28d050f68") });
            builder.Entity<RkAccount>().HasData(new RkAccount() { Name = "_Счёт 62: Начальное значение(отн.ед.)", RkAccountId = Guid.Parse("d6d2e616-39b5-4b16-8fdb-15e28d050f69") });
            builder.Entity<RkAccount>().HasData(new RkAccount() { Name = "_Счёт 68: Начальное значение(отн.ед.)", RkAccountId = Guid.Parse("d6d2e616-39b5-4b16-8fdb-15e28d050f10") });
            builder.Entity<RkAccount>().HasData(new RkAccount() { Name = "_Счёт 69: Начальное значение(отн.ед.)", RkAccountId = Guid.Parse("d6d2e616-39b5-4b16-8fdb-15e28d050f11") });
            builder.Entity<RkAccount>().HasData(new RkAccount() { Name = "_Счёт 70: Начальное значение(отн.ед.)", RkAccountId = Guid.Parse("d6d2e616-39b5-4b16-8fdb-15e28d050f12") });
            builder.Entity<RkAccount>().HasData(new RkAccount() { Name = "_Счёт 76: Начальное значение(отн.ед.)", RkAccountId = Guid.Parse("d6d2e616-39b5-4b16-8fdb-15e28d050f13") });
            builder.Entity<RkAccount>().HasData(new RkAccount() { Name = "_Счёт 81: Начальное значение(отн.ед.)", RkAccountId = Guid.Parse("d6d2e616-39b5-4b16-8fdb-15e28d050f14") });
            builder.Entity<RkAccount>().HasData(new RkAccount() { Name = "_Счёт 83: Начальное значение(отн.ед.)", RkAccountId = Guid.Parse("d6d2e616-39b5-4b16-8fdb-15e28d050f15") });
            builder.Entity<RkAccount>().HasData(new RkAccount() { Name = "_Счёт 84: Начальное значение(отн.ед.)", RkAccountId = Guid.Parse("d6d2e616-39b5-4b16-8fdb-15e28d050f16") });
            builder.Entity<RkAccount>().HasData(new RkAccount() { Name = "_Счёт 90: Начальное значение(отн.ед.)", RkAccountId = Guid.Parse("d6d2e616-39b5-4b16-8fdb-15e28d050f17") });
            builder.Entity<RkAccount>().HasData(new RkAccount() { Name = "_Счёт 99: Начальное значение(отн.ед.)", RkAccountId = Guid.Parse("d6d2e616-39b5-4b16-8fdb-15e28d050f18") });
        }
    }
}
