using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace belsim2020.Database.Migrations
{
    public partial class Accounts : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f6f"));

            migrationBuilder.DeleteData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("eaacc9f3-a658-4218-ac77-3aefcf278c34"));

            migrationBuilder.InsertData(
                table: "RK_Accounts",
                columns: new[] { "RkAccountId", "Name" },
                values: new object[,]
                {
                    { new Guid("eaacc9f3-a658-4218-ac77-3aefcf278c3d"), "_Счёт 10: Начальное значение(руб.)" },
                    { new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f16"), "_Счёт 84: Начальное значение(руб.)" },
                    { new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f15"), "_Счёт 83: Начальное значение(руб.)" },
                    { new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f14"), "_Счёт 81: Начальное значение(руб.)" },
                    { new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f13"), "_Счёт 76: Начальное значение(руб.)" },
                    { new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f12"), "_Счёт 70: Начальное значение(руб.)" },
                    { new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f11"), "_Счёт 69: Начальное значение(руб.)" },
                    { new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f10"), "_Счёт 68: Начальное значение(руб.)" },
                    { new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f69"), "_Счёт 62: Начальное значение(руб.)" },
                    { new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f68"), "_Счёт 60: Начальное значение(руб.)" },
                    { new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f67"), "_Счёт 51: Начальное значение(руб.)" },
                    { new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f66"), "_Счёт 50: Начальное значение(руб.)" },
                    { new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f65"), "_Счёт 43: Начальное значение(руб.)" },
                    { new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f64"), "_Счёт 40: Начальное значение(руб.)" },
                    { new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f63"), "_Счёт 20: Начальное значение(руб.)" },
                    { new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f62"), "_Счёт 18: Начальное значение(руб.)" },
                    { new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f17"), "_Счёт 90: Начальное значение(руб.)" },
                    { new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f18"), "_Счёт 99: Начальное значение(руб.)" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f10"));

            migrationBuilder.DeleteData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f11"));

            migrationBuilder.DeleteData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f12"));

            migrationBuilder.DeleteData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f13"));

            migrationBuilder.DeleteData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f14"));

            migrationBuilder.DeleteData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f15"));

            migrationBuilder.DeleteData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f16"));

            migrationBuilder.DeleteData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f17"));

            migrationBuilder.DeleteData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f18"));

            migrationBuilder.DeleteData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f62"));

            migrationBuilder.DeleteData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f63"));

            migrationBuilder.DeleteData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f64"));

            migrationBuilder.DeleteData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f65"));

            migrationBuilder.DeleteData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f66"));

            migrationBuilder.DeleteData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f67"));

            migrationBuilder.DeleteData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f68"));

            migrationBuilder.DeleteData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f69"));

            migrationBuilder.DeleteData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("eaacc9f3-a658-4218-ac77-3aefcf278c3d"));

            migrationBuilder.InsertData(
                table: "RK_Accounts",
                columns: new[] { "RkAccountId", "Name" },
                values: new object[,]
                {
                    { new Guid("eaacc9f3-a658-4218-ac77-3aefcf278c34"), "_Счет 1" },
                    { new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f6f"), "_Счет 2" }
                });
        }
    }
}
