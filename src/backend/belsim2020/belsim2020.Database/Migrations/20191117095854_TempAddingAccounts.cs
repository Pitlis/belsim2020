using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace belsim2020.Database.Migrations
{
    public partial class TempAddingAccounts : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3cdb6f5c-b7a9-45fc-a2b8-29a13c03f87f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "503ad8ae-2002-450a-b529-99301a1ff229");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "7f3486f5-a375-4d26-a35c-c9f9a40e10df", "e0737312-c6b4-4871-8a94-ef1de32d7a30", "admin", "ADMIN" },
                    { "42f311b8-91e7-4621-b36b-0fa330092ee1", "25919c89-81dc-4902-8d5d-e43a95a735d5", "user", "USER" }
                });

            migrationBuilder.InsertData(
                table: "RK_Accounts",
                columns: new[] { "RkAccountId", "Name" },
                values: new object[,]
                {
                    { new Guid("eaacc9f3-a658-4218-ac77-3aefcf278c34"), "_Счет 1" },
                    { new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f6f"), "_Счет 2" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "42f311b8-91e7-4621-b36b-0fa330092ee1");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7f3486f5-a375-4d26-a35c-c9f9a40e10df");

            migrationBuilder.DeleteData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f6f"));

            migrationBuilder.DeleteData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("eaacc9f3-a658-4218-ac77-3aefcf278c34"));

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "503ad8ae-2002-450a-b529-99301a1ff229", "d966e1bf-7f0f-459c-8af3-c3258932bdde", "admin", "ADMIN" },
                    { "3cdb6f5c-b7a9-45fc-a2b8-29a13c03f87f", "57838587-2a05-4243-ba0c-fa23fd965669", "user", "USER" }
                });
        }
    }
}
