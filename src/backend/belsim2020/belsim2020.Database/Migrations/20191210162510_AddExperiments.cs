using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace belsim2020.Database.Migrations
{
    public partial class AddExperiments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RK_Experiments",
                columns: table => new
                {
                    RkExperimentId = table.Column<Guid>(nullable: false),
                    ExperimentTemplateId = table.Column<Guid>(nullable: false),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    CreatedById = table.Column<string>(nullable: true),
                    ExperimentData = table.Column<string>(nullable: true),
                    ResultData = table.Column<string>(nullable: true),
                    Status = table.Column<int>(nullable: false),
                    StatusChangedAt = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RK_Experiments", x => x.RkExperimentId);
                    table.ForeignKey(
                        name: "FK_RK_Experiments_AspNetUsers_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RK_Experiments_RK_ExperimentTemplates_ExperimentTemplateId",
                        column: x => x.ExperimentTemplateId,
                        principalTable: "RK_ExperimentTemplates",
                        principalColumn: "RkExperimentTemplateId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RK_Experiments_CreatedById",
                table: "RK_Experiments",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_RK_Experiments_ExperimentTemplateId",
                table: "RK_Experiments",
                column: "ExperimentTemplateId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RK_Experiments");
        }
    }
}
