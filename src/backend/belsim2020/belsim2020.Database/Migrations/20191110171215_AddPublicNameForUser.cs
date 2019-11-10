using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace belsim2020.Database.Migrations
{
    public partial class AddPublicNameForUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6ff358d8-2165-451f-bff8-4e4185ac648b");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a1e9b666-2880-4ee2-ba85-b01e7a563e2a");

            migrationBuilder.AddColumn<string>(
                name: "PublicName",
                table: "AspNetUsers",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "RK_Resources",
                columns: table => new
                {
                    RkResourceId = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RK_Resources", x => x.RkResourceId);
                });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "bb1ab920-d208-4cd9-99ec-00d8aaea272b", "8518cb19-c034-4ec1-84eb-5c6454f281b8", "admin", "ADMIN" },
                    { "a47e2268-24ba-4296-8127-1a43f0e0b5a9", "a779d541-931e-4763-a0b0-8de60b4dc9c6", "user", "USER" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RK_Resources");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a47e2268-24ba-4296-8127-1a43f0e0b5a9");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "bb1ab920-d208-4cd9-99ec-00d8aaea272b");

            migrationBuilder.DropColumn(
                name: "PublicName",
                table: "AspNetUsers");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "a1e9b666-2880-4ee2-ba85-b01e7a563e2a", "93c66e6c-c939-46c5-ae24-0ec36cb93f7f", "admin", "ADMIN" },
                    { "6ff358d8-2165-451f-bff8-4e4185ac648b", "867f5d37-858c-4e0e-8238-b15ec41f589a", "user", "USER" }
                });
        }
    }
}
