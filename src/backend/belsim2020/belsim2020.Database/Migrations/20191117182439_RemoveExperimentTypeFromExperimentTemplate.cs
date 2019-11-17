using Microsoft.EntityFrameworkCore.Migrations;

namespace belsim2020.Database.Migrations
{
    public partial class RemoveExperimentTypeFromExperimentTemplate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "42f311b8-91e7-4621-b36b-0fa330092ee1");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7f3486f5-a375-4d26-a35c-c9f9a40e10df");

            migrationBuilder.DropColumn(
                name: "ExperimentType",
                table: "RK_ExperimentTemplates");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "ca7e6b7f-ddfc-4511-a9bf-cca8ad67740b", "34422411-bc34-403c-9ab7-7b38419aa099", "admin", "ADMIN" },
                    { "6b3f8340-34a4-44a0-9002-dba91a26509f", "a26a99f6-cbe2-4dea-8bd8-c65def948f1b", "user", "USER" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6b3f8340-34a4-44a0-9002-dba91a26509f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ca7e6b7f-ddfc-4511-a9bf-cca8ad67740b");

            migrationBuilder.AddColumn<int>(
                name: "ExperimentType",
                table: "RK_ExperimentTemplates",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "7f3486f5-a375-4d26-a35c-c9f9a40e10df", "e0737312-c6b4-4871-8a94-ef1de32d7a30", "admin", "ADMIN" },
                    { "42f311b8-91e7-4621-b36b-0fa330092ee1", "25919c89-81dc-4902-8d5d-e43a95a735d5", "user", "USER" }
                });
        }
    }
}
