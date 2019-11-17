﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using belsim2020.Database;

namespace belsim2020.Database.Migrations
{
    [DbContext(typeof(Belsim2020DbContext))]
    [Migration("20191117182439_RemoveExperimentTypeFromExperimentTemplate")]
    partial class RemoveExperimentTypeFromExperimentTemplate
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
                .HasAnnotation("ProductVersion", "2.2.4-servicing-10062")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(450);

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Name")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasName("RoleNameIndex");

                    b.ToTable("AspNetRoles");

                    b.HasData(
                        new
                        {
                            Id = "ca7e6b7f-ddfc-4511-a9bf-cca8ad67740b",
                            ConcurrencyStamp = "34422411-bc34-403c-9ab7-7b38419aa099",
                            Name = "admin",
                            NormalizedName = "ADMIN"
                        },
                        new
                        {
                            Id = "6b3f8340-34a4-44a0-9002-dba91a26509f",
                            ConcurrencyStamp = "a26a99f6-cbe2-4dea-8bd8-c65def948f1b",
                            Name = "user",
                            NormalizedName = "USER"
                        });
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("RoleId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUser", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(450);

                    b.Property<int>("AccessFailedCount");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Discriminator")
                        .IsRequired();

                    b.Property<string>("Email")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailConfirmed");

                    b.Property<bool>("LockoutEnabled");

                    b.Property<DateTimeOffset?>("LockoutEnd");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256);

                    b.Property<string>("PasswordHash");

                    b.Property<string>("PhoneNumber");

                    b.Property<bool>("PhoneNumberConfirmed");

                    b.Property<string>("SecurityStamp");

                    b.Property<bool>("TwoFactorEnabled");

                    b.Property<string>("UserName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex");

                    b.ToTable("AspNetUsers");

                    b.HasDiscriminator<string>("Discriminator").HasValue("IdentityUser");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasMaxLength(450);

                    b.Property<string>("ProviderKey")
                        .HasMaxLength(450);

                    b.Property<string>("ProviderDisplayName");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("RoleId");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("LoginProvider")
                        .HasMaxLength(450);

                    b.Property<string>("Name")
                        .HasMaxLength(450);

                    b.Property<string>("Value");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens");
                });

            modelBuilder.Entity("belsim2020.Entities.Project", b =>
                {
                    b.Property<Guid>("ProjectId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Comments");

                    b.Property<DateTime>("CreatedAt");

                    b.Property<DateTime>("ModifiedAt");

                    b.Property<string>("OrganizationName");

                    b.Property<string>("ProjectName");

                    b.Property<int>("ProjectType");

                    b.HasKey("ProjectId");

                    b.ToTable("Projects");
                });

            modelBuilder.Entity("belsim2020.Entities.RkAccount", b =>
                {
                    b.Property<Guid>("RkAccountId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name");

                    b.HasKey("RkAccountId");

                    b.ToTable("RK_Accounts");

                    b.HasData(
                        new
                        {
                            RkAccountId = new Guid("eaacc9f3-a658-4218-ac77-3aefcf278c34"),
                            Name = "_Счет 1"
                        },
                        new
                        {
                            RkAccountId = new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f6f"),
                            Name = "_Счет 2"
                        });
                });

            modelBuilder.Entity("belsim2020.Entities.RkAccountInExperiment", b =>
                {
                    b.Property<Guid>("RkAccountInExperimentId")
                        .ValueGeneratedOnAdd();

                    b.Property<Guid>("AccountId");

                    b.Property<Guid>("ExperimentTemplateId");

                    b.Property<decimal>("Value");

                    b.HasKey("RkAccountInExperimentId");

                    b.HasIndex("AccountId");

                    b.HasIndex("ExperimentTemplateId");

                    b.ToTable("RK_RkAccountsInExperiment");
                });

            modelBuilder.Entity("belsim2020.Entities.RkExperimentTemplate", b =>
                {
                    b.Property<Guid>("RkExperimentTemplateId")
                        .ValueGeneratedOnAdd();

                    b.Property<decimal>("AmortizationQuota");

                    b.Property<decimal>("CostsChangeCoefficient");

                    b.Property<int>("CostsChangeDistrFuncType");

                    b.Property<int>("CostsChangeInterval");

                    b.Property<int>("CostsChangeIntervalDistrFuncType");

                    b.Property<int>("CostsChangeIntervalStdDev");

                    b.Property<decimal>("CostsChangeStdDev");

                    b.Property<int>("CountRuns");

                    b.Property<DateTime>("CreatedAt");

                    b.Property<int>("CreditCycle");

                    b.Property<int>("CreditInterval");

                    b.Property<string>("Description");

                    b.Property<decimal>("EarningsTax");

                    b.Property<decimal>("EcologicalTax");

                    b.Property<decimal>("FixedCosts");

                    b.Property<decimal>("FundTax");

                    b.Property<decimal>("InterestRate");

                    b.Property<int>("Interval");

                    b.Property<bool>("IsCreditUsed");

                    b.Property<decimal>("LandTax");

                    b.Property<decimal>("LiquidityRatio");

                    b.Property<DateTime>("ModifiedAt");

                    b.Property<string>("Name");

                    b.Property<decimal>("OvervalueCoefficient");

                    b.Property<string>("OwnerId");

                    b.Property<int>("PaymentDate");

                    b.Property<int>("PaymentDateDistrFuncType");

                    b.Property<int>("PaymentDateStdDev");

                    b.Property<int>("Period");

                    b.Property<int>("PlanningInterval");

                    b.Property<int>("PlanningIntervalsCount");

                    b.Property<decimal>("PriceChangeCoefficient");

                    b.Property<int>("PriceChangeCoefficientDistrFuncType");

                    b.Property<decimal>("PriceChangeCoefficientStdDev");

                    b.Property<int>("PriceChangeInterval");

                    b.Property<int>("PriceChangeIntervalDistrFuncType");

                    b.Property<int>("PriceChangeIntervalStdDev");

                    b.Property<decimal>("ProfitsTax");

                    b.Property<Guid>("ProjectId");

                    b.Property<decimal>("RealEstateTax");

                    b.Property<decimal>("ReplacementCost");

                    b.Property<decimal>("RestProfitsTax");

                    b.Property<decimal>("SettlementAccountVolume");

                    b.Property<int>("ShipmentsCount");

                    b.Property<int>("ShippingCycle");

                    b.Property<int>("ShippingCycleDistrFuncType");

                    b.Property<int>("ShippingCycleStdDev");

                    b.Property<int>("SupplyPaymentDate");

                    b.Property<int>("SupplyPaymentDateDistrFuncType");

                    b.Property<int>("SupplyPaymentDateStdDev");

                    b.Property<decimal>("SupplyPriceChangeCoefficient");

                    b.Property<int>("SupplyPriceChangeCoefficientDistrFuncType");

                    b.Property<decimal>("SupplyPriceChangeCoefficientStdDev");

                    b.Property<int>("SupplyPriceChangeInterval");

                    b.Property<int>("SupplyPriceChangeIntervalDistrFuncType");

                    b.Property<decimal>("SupplyPriceChangeIntervalStdDev");

                    b.Property<decimal>("VAT");

                    b.Property<decimal>("WageShare");

                    b.Property<decimal>("WageTax");

                    b.Property<decimal>("WearFactor");

                    b.HasKey("RkExperimentTemplateId");

                    b.HasIndex("OwnerId");

                    b.HasIndex("ProjectId");

                    b.ToTable("RK_ExperimentTemplates");
                });

            modelBuilder.Entity("belsim2020.Entities.RkProduct", b =>
                {
                    b.Property<Guid>("RkProductId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name");

                    b.Property<string>("NormalizedName");

                    b.Property<Guid>("ProjectId");

                    b.HasKey("RkProductId");

                    b.HasIndex("ProjectId");

                    b.ToTable("RK_Products");
                });

            modelBuilder.Entity("belsim2020.Entities.RkProductInExperiment", b =>
                {
                    b.Property<Guid>("RkProductInExperimentId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("CycleTime");

                    b.Property<Guid>("ExperimentTemplateId");

                    b.Property<decimal>("FinishedProductCost");

                    b.Property<decimal>("FinishedProductCount");

                    b.Property<decimal>("Price");

                    b.Property<Guid>("ProductId");

                    b.Property<decimal>("ShipmentVolume");

                    b.Property<int>("ShipmentVolumeDistrFuncType");

                    b.Property<decimal>("ShipmentVolumeStdDev");

                    b.Property<decimal>("VariableCosts");

                    b.Property<decimal>("WageShare");

                    b.HasKey("RkProductInExperimentId");

                    b.HasIndex("ExperimentTemplateId");

                    b.HasIndex("ProductId");

                    b.ToTable("RK_ProductsInExperiment");
                });

            modelBuilder.Entity("belsim2020.Entities.RkProductResourceInExperiment", b =>
                {
                    b.Property<Guid>("RkProductResourceInExperimentId")
                        .ValueGeneratedOnAdd();

                    b.Property<double>("ResourceConsumption");

                    b.Property<Guid>("RkProductInExperimentId");

                    b.Property<Guid>("RkResourceInExperimentId");

                    b.HasKey("RkProductResourceInExperimentId");

                    b.HasIndex("RkProductInExperimentId");

                    b.HasIndex("RkResourceInExperimentId");

                    b.ToTable("RK_RkProductResourceInExperiment");
                });

            modelBuilder.Entity("belsim2020.Entities.RkProductShipmentInExperiment", b =>
                {
                    b.Property<Guid>("RkProductShipmentInExperimentId")
                        .ValueGeneratedOnAdd();

                    b.Property<Guid>("ProductInExperimentId");

                    b.Property<int>("ShipmentDatetime");

                    b.Property<double>("Volume");

                    b.HasKey("RkProductShipmentInExperimentId");

                    b.HasIndex("ProductInExperimentId");

                    b.ToTable("RK_RkProductShipmentsInExperiment");
                });

            modelBuilder.Entity("belsim2020.Entities.RkResource", b =>
                {
                    b.Property<Guid>("RkResourceId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name");

                    b.Property<string>("NormalizedName");

                    b.Property<Guid>("ProjectId");

                    b.HasKey("RkResourceId");

                    b.HasIndex("ProjectId");

                    b.ToTable("RK_Resources");
                });

            modelBuilder.Entity("belsim2020.Entities.RkResourceInExperiment", b =>
                {
                    b.Property<Guid>("RkResourceInExperimentId")
                        .ValueGeneratedOnAdd();

                    b.Property<Guid>("ExperimentTemplateId");

                    b.Property<decimal>("Price");

                    b.Property<Guid>("ResourceId");

                    b.Property<decimal>("StoredResourcePrice");

                    b.Property<double>("StoredResourcesCount");

                    b.HasKey("RkResourceInExperimentId");

                    b.HasIndex("ExperimentTemplateId");

                    b.HasIndex("ResourceId");

                    b.ToTable("RK_ResourcesInExperiment");
                });

            modelBuilder.Entity("belsim2020.Entities.UserProject", b =>
                {
                    b.Property<Guid>("ProjectId");

                    b.Property<string>("UserId");

                    b.Property<bool>("IsProjectOwner");

                    b.HasKey("ProjectId", "UserId");

                    b.HasIndex("UserId");

                    b.ToTable("UserProject");
                });

            modelBuilder.Entity("belsim2020.Entities.User", b =>
                {
                    b.HasBaseType("Microsoft.AspNetCore.Identity.IdentityUser");

                    b.Property<string>("Comments");

                    b.Property<string>("OrganizationName");

                    b.Property<string>("PublicName");

                    b.HasDiscriminator().HasValue("User");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("belsim2020.Entities.RkAccountInExperiment", b =>
                {
                    b.HasOne("belsim2020.Entities.RkAccount", "Account")
                        .WithMany()
                        .HasForeignKey("AccountId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("belsim2020.Entities.RkExperimentTemplate", "ExperimentTemplate")
                        .WithMany("Accounts")
                        .HasForeignKey("ExperimentTemplateId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("belsim2020.Entities.RkExperimentTemplate", b =>
                {
                    b.HasOne("belsim2020.Entities.User", "Owner")
                        .WithMany()
                        .HasForeignKey("OwnerId");

                    b.HasOne("belsim2020.Entities.Project", "Project")
                        .WithMany()
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("belsim2020.Entities.RkProduct", b =>
                {
                    b.HasOne("belsim2020.Entities.Project", "Project")
                        .WithMany()
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("belsim2020.Entities.RkProductInExperiment", b =>
                {
                    b.HasOne("belsim2020.Entities.RkExperimentTemplate", "ExperimentTemplate")
                        .WithMany("Products")
                        .HasForeignKey("ExperimentTemplateId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("belsim2020.Entities.RkProduct", "Product")
                        .WithMany()
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("belsim2020.Entities.RkProductResourceInExperiment", b =>
                {
                    b.HasOne("belsim2020.Entities.RkProductInExperiment", "RkProductInExperiment")
                        .WithMany("Resources")
                        .HasForeignKey("RkProductInExperimentId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("belsim2020.Entities.RkResourceInExperiment", "ResourceInExperiment")
                        .WithMany()
                        .HasForeignKey("RkResourceInExperimentId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("belsim2020.Entities.RkProductShipmentInExperiment", b =>
                {
                    b.HasOne("belsim2020.Entities.RkProductInExperiment", "ProductInExperiment")
                        .WithMany("Shipments")
                        .HasForeignKey("ProductInExperimentId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("belsim2020.Entities.RkResource", b =>
                {
                    b.HasOne("belsim2020.Entities.Project", "Project")
                        .WithMany()
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("belsim2020.Entities.RkResourceInExperiment", b =>
                {
                    b.HasOne("belsim2020.Entities.RkExperimentTemplate", "ExperimentTemplate")
                        .WithMany("Resources")
                        .HasForeignKey("ExperimentTemplateId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("belsim2020.Entities.RkResource", "Resource")
                        .WithMany()
                        .HasForeignKey("ResourceId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("belsim2020.Entities.UserProject", b =>
                {
                    b.HasOne("belsim2020.Entities.Project", "Project")
                        .WithMany("Users")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("belsim2020.Entities.User", "User")
                        .WithMany("Projects")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
