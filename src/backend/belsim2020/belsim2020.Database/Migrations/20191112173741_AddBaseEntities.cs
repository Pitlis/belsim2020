using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace belsim2020.Database.Migrations
{
    public partial class AddBaseEntities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6d987a38-d358-41f5-892b-f0bd6bc11c55");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b64bf53c-b02b-4b3c-8775-215cc60b2894");

            migrationBuilder.AddColumn<string>(
                name: "NormalizedName",
                table: "RK_Resources",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ProjectId",
                table: "RK_Resources",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "RK_Accounts",
                columns: table => new
                {
                    RkAccountId = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RK_Accounts", x => x.RkAccountId);
                });

            migrationBuilder.CreateTable(
                name: "RK_ExperimentTemplates",
                columns: table => new
                {
                    RkExperimentTemplateId = table.Column<Guid>(nullable: false),
                    OwnerId = table.Column<string>(nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    ModifiedAt = table.Column<DateTime>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    ProjectId = table.Column<Guid>(nullable: false),
                    ExperimentType = table.Column<int>(nullable: false),
                    CountRuns = table.Column<int>(nullable: false),
                    Period = table.Column<int>(nullable: false),
                    Interval = table.Column<int>(nullable: false),
                    PlanningInterval = table.Column<int>(nullable: false),
                    PlanningIntervalsCount = table.Column<int>(nullable: false),
                    ShipmentsCount = table.Column<int>(nullable: false),
                    ShippingCycle = table.Column<int>(nullable: false),
                    ShippingCycleStdDev = table.Column<int>(nullable: false),
                    ShippingCycleDistrFuncType = table.Column<int>(nullable: false),
                    PaymentDate = table.Column<int>(nullable: false),
                    PaymentDateStdDev = table.Column<int>(nullable: false),
                    PaymentDateDistrFuncType = table.Column<int>(nullable: false),
                    PriceChangeCoefficient = table.Column<decimal>(nullable: false),
                    PriceChangeCoefficientStdDev = table.Column<decimal>(nullable: false),
                    PriceChangeCoefficientDistrFuncType = table.Column<int>(nullable: false),
                    PriceChangeInterval = table.Column<int>(nullable: false),
                    PriceChangeIntervalStdDev = table.Column<int>(nullable: false),
                    PriceChangeIntervalDistrFuncType = table.Column<int>(nullable: false),
                    SupplyPaymentDate = table.Column<int>(nullable: false),
                    SupplyPaymentDateStdDev = table.Column<int>(nullable: false),
                    SupplyPaymentDateDistrFuncType = table.Column<int>(nullable: false),
                    SupplyPriceChangeCoefficient = table.Column<decimal>(nullable: false),
                    SupplyPriceChangeCoefficientStdDev = table.Column<decimal>(nullable: false),
                    SupplyPriceChangeCoefficientDistrFuncType = table.Column<int>(nullable: false),
                    SupplyPriceChangeInterval = table.Column<int>(nullable: false),
                    SupplyPriceChangeIntervalStdDev = table.Column<decimal>(nullable: false),
                    SupplyPriceChangeIntervalDistrFuncType = table.Column<int>(nullable: false),
                    SettlementAccountVolume = table.Column<decimal>(nullable: false),
                    IsCreditUsed = table.Column<bool>(nullable: false),
                    InterestRate = table.Column<decimal>(nullable: false),
                    CreditInterval = table.Column<int>(nullable: false),
                    CreditCycle = table.Column<int>(nullable: false),
                    LiquidityRatio = table.Column<decimal>(nullable: false),
                    FixedCosts = table.Column<decimal>(nullable: false),
                    WageShare = table.Column<decimal>(nullable: false),
                    CostsChangeCoefficient = table.Column<decimal>(nullable: false),
                    CostsChangeStdDev = table.Column<decimal>(nullable: false),
                    CostsChangeDistrFuncType = table.Column<int>(nullable: false),
                    CostsChangeInterval = table.Column<int>(nullable: false),
                    CostsChangeIntervalStdDev = table.Column<int>(nullable: false),
                    CostsChangeIntervalDistrFuncType = table.Column<int>(nullable: false),
                    ReplacementCost = table.Column<decimal>(nullable: false),
                    WearFactor = table.Column<decimal>(nullable: false),
                    AmortizationQuota = table.Column<decimal>(nullable: false),
                    OvervalueCoefficient = table.Column<decimal>(nullable: false),
                    VAT = table.Column<decimal>(nullable: false),
                    EarningsTax = table.Column<decimal>(nullable: false),
                    ProfitsTax = table.Column<decimal>(nullable: false),
                    RestProfitsTax = table.Column<decimal>(nullable: false),
                    FundTax = table.Column<decimal>(nullable: false),
                    WageTax = table.Column<decimal>(nullable: false),
                    RealEstateTax = table.Column<decimal>(nullable: false),
                    EcologicalTax = table.Column<decimal>(nullable: false),
                    LandTax = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RK_ExperimentTemplates", x => x.RkExperimentTemplateId);
                    table.ForeignKey(
                        name: "FK_RK_ExperimentTemplates_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RK_ExperimentTemplates_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "ProjectId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RK_Products",
                columns: table => new
                {
                    RkProductId = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    NormalizedName = table.Column<string>(nullable: true),
                    ProjectId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RK_Products", x => x.RkProductId);
                    table.ForeignKey(
                        name: "FK_RK_Products_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "ProjectId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RK_ResourcesInExperiment",
                columns: table => new
                {
                    RkResourceInExperimentId = table.Column<Guid>(nullable: false),
                    ResourceId = table.Column<Guid>(nullable: false),
                    ExperimentTemplateId = table.Column<Guid>(nullable: false),
                    StoredResourcesCount = table.Column<double>(nullable: false),
                    StoredResourcePrice = table.Column<decimal>(nullable: false),
                    Price = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RK_ResourcesInExperiment", x => x.RkResourceInExperimentId);
                    table.ForeignKey(
                        name: "FK_RK_ResourcesInExperiment_RK_ExperimentTemplates_ExperimentT~",
                        column: x => x.ExperimentTemplateId,
                        principalTable: "RK_ExperimentTemplates",
                        principalColumn: "RkExperimentTemplateId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RK_ResourcesInExperiment_RK_Resources_ResourceId",
                        column: x => x.ResourceId,
                        principalTable: "RK_Resources",
                        principalColumn: "RkResourceId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RK_RkAccountsInExperiment",
                columns: table => new
                {
                    RkAccountInExperimentId = table.Column<Guid>(nullable: false),
                    AccountId = table.Column<Guid>(nullable: false),
                    ExperimentTemplateId = table.Column<Guid>(nullable: false),
                    Value = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RK_RkAccountsInExperiment", x => x.RkAccountInExperimentId);
                    table.ForeignKey(
                        name: "FK_RK_RkAccountsInExperiment_RK_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "RK_Accounts",
                        principalColumn: "RkAccountId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RK_RkAccountsInExperiment_RK_ExperimentTemplates_Experiment~",
                        column: x => x.ExperimentTemplateId,
                        principalTable: "RK_ExperimentTemplates",
                        principalColumn: "RkExperimentTemplateId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RK_ProductsInExperiment",
                columns: table => new
                {
                    RkProductInExperimentId = table.Column<Guid>(nullable: false),
                    ProductId = table.Column<Guid>(nullable: false),
                    ExperimentTemplateId = table.Column<Guid>(nullable: false),
                    CycleTime = table.Column<int>(nullable: false),
                    FinishedProductCount = table.Column<decimal>(nullable: false),
                    FinishedProductCost = table.Column<decimal>(nullable: false),
                    ShipmentVolume = table.Column<decimal>(nullable: false),
                    ShipmentVolumeStdDev = table.Column<decimal>(nullable: false),
                    ShipmentVolumeDistrFuncType = table.Column<int>(nullable: false),
                    Price = table.Column<decimal>(nullable: false),
                    VariableCosts = table.Column<decimal>(nullable: false),
                    WageShare = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RK_ProductsInExperiment", x => x.RkProductInExperimentId);
                    table.ForeignKey(
                        name: "FK_RK_ProductsInExperiment_RK_ExperimentTemplates_ExperimentTe~",
                        column: x => x.ExperimentTemplateId,
                        principalTable: "RK_ExperimentTemplates",
                        principalColumn: "RkExperimentTemplateId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RK_ProductsInExperiment_RK_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "RK_Products",
                        principalColumn: "RkProductId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RK_RkProductResourceInExperiment",
                columns: table => new
                {
                    RkProductResourceInExperimentId = table.Column<Guid>(nullable: false),
                    RkResourceInExperimentId = table.Column<Guid>(nullable: false),
                    RkProductInExperimentId = table.Column<Guid>(nullable: false),
                    ResourceConsumption = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RK_RkProductResourceInExperiment", x => x.RkProductResourceInExperimentId);
                    table.ForeignKey(
                        name: "FK_RK_RkProductResourceInExperiment_RK_ProductsInExperiment_Rk~",
                        column: x => x.RkProductInExperimentId,
                        principalTable: "RK_ProductsInExperiment",
                        principalColumn: "RkProductInExperimentId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RK_RkProductResourceInExperiment_RK_ResourcesInExperiment_R~",
                        column: x => x.RkResourceInExperimentId,
                        principalTable: "RK_ResourcesInExperiment",
                        principalColumn: "RkResourceInExperimentId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RK_RkProductShipmentsInExperiment",
                columns: table => new
                {
                    RkProductShipmentInExperimentId = table.Column<Guid>(nullable: false),
                    ProductInExperimentId = table.Column<Guid>(nullable: false),
                    Volume = table.Column<double>(nullable: false),
                    ShipmentDatetime = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RK_RkProductShipmentsInExperiment", x => x.RkProductShipmentInExperimentId);
                    table.ForeignKey(
                        name: "FK_RK_RkProductShipmentsInExperiment_RK_ProductsInExperiment_P~",
                        column: x => x.ProductInExperimentId,
                        principalTable: "RK_ProductsInExperiment",
                        principalColumn: "RkProductInExperimentId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "503ad8ae-2002-450a-b529-99301a1ff229", "d966e1bf-7f0f-459c-8af3-c3258932bdde", "admin", "ADMIN" },
                    { "3cdb6f5c-b7a9-45fc-a2b8-29a13c03f87f", "57838587-2a05-4243-ba0c-fa23fd965669", "user", "USER" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_RK_Resources_ProjectId",
                table: "RK_Resources",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_RK_ExperimentTemplates_OwnerId",
                table: "RK_ExperimentTemplates",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_RK_ExperimentTemplates_ProjectId",
                table: "RK_ExperimentTemplates",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_RK_Products_ProjectId",
                table: "RK_Products",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_RK_ProductsInExperiment_ExperimentTemplateId",
                table: "RK_ProductsInExperiment",
                column: "ExperimentTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_RK_ProductsInExperiment_ProductId",
                table: "RK_ProductsInExperiment",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_RK_ResourcesInExperiment_ExperimentTemplateId",
                table: "RK_ResourcesInExperiment",
                column: "ExperimentTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_RK_ResourcesInExperiment_ResourceId",
                table: "RK_ResourcesInExperiment",
                column: "ResourceId");

            migrationBuilder.CreateIndex(
                name: "IX_RK_RkAccountsInExperiment_AccountId",
                table: "RK_RkAccountsInExperiment",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_RK_RkAccountsInExperiment_ExperimentTemplateId",
                table: "RK_RkAccountsInExperiment",
                column: "ExperimentTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_RK_RkProductResourceInExperiment_RkProductInExperimentId",
                table: "RK_RkProductResourceInExperiment",
                column: "RkProductInExperimentId");

            migrationBuilder.CreateIndex(
                name: "IX_RK_RkProductResourceInExperiment_RkResourceInExperimentId",
                table: "RK_RkProductResourceInExperiment",
                column: "RkResourceInExperimentId");

            migrationBuilder.CreateIndex(
                name: "IX_RK_RkProductShipmentsInExperiment_ProductInExperimentId",
                table: "RK_RkProductShipmentsInExperiment",
                column: "ProductInExperimentId");

            migrationBuilder.AddForeignKey(
                name: "FK_RK_Resources_Projects_ProjectId",
                table: "RK_Resources",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "ProjectId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RK_Resources_Projects_ProjectId",
                table: "RK_Resources");

            migrationBuilder.DropTable(
                name: "RK_RkAccountsInExperiment");

            migrationBuilder.DropTable(
                name: "RK_RkProductResourceInExperiment");

            migrationBuilder.DropTable(
                name: "RK_RkProductShipmentsInExperiment");

            migrationBuilder.DropTable(
                name: "RK_Accounts");

            migrationBuilder.DropTable(
                name: "RK_ResourcesInExperiment");

            migrationBuilder.DropTable(
                name: "RK_ProductsInExperiment");

            migrationBuilder.DropTable(
                name: "RK_ExperimentTemplates");

            migrationBuilder.DropTable(
                name: "RK_Products");

            migrationBuilder.DropIndex(
                name: "IX_RK_Resources_ProjectId",
                table: "RK_Resources");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3cdb6f5c-b7a9-45fc-a2b8-29a13c03f87f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "503ad8ae-2002-450a-b529-99301a1ff229");

            migrationBuilder.DropColumn(
                name: "NormalizedName",
                table: "RK_Resources");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "RK_Resources");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "6d987a38-d358-41f5-892b-f0bd6bc11c55", "ed794382-958f-4f96-9b53-b03fdfbab6a4", "admin", "ADMIN" },
                    { "b64bf53c-b02b-4b3c-8775-215cc60b2894", "cb3406a8-5916-4ae0-82b7-52356c0dda36", "user", "USER" }
                });
        }
    }
}
