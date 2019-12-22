using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace belsim2020.Database.Migrations
{
    public partial class RenameAccounts : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f10"),
                column: "Name",
                value: "_Счёт 68: Начальное значение(отн.ед.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f11"),
                column: "Name",
                value: "_Счёт 69: Начальное значение(отн.ед.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f12"),
                column: "Name",
                value: "_Счёт 70: Начальное значение(отн.ед.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f13"),
                column: "Name",
                value: "_Счёт 76: Начальное значение(отн.ед.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f14"),
                column: "Name",
                value: "_Счёт 81: Начальное значение(отн.ед.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f15"),
                column: "Name",
                value: "_Счёт 83: Начальное значение(отн.ед.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f16"),
                column: "Name",
                value: "_Счёт 84: Начальное значение(отн.ед.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f17"),
                column: "Name",
                value: "_Счёт 90: Начальное значение(отн.ед.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f18"),
                column: "Name",
                value: "_Счёт 99: Начальное значение(отн.ед.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f62"),
                column: "Name",
                value: "_Счёт 18: Начальное значение(отн.ед.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f63"),
                column: "Name",
                value: "_Счёт 20: Начальное значение(отн.ед.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f64"),
                column: "Name",
                value: "_Счёт 40: Начальное значение(отн.ед.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f65"),
                column: "Name",
                value: "_Счёт 43: Начальное значение(отн.ед.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f66"),
                column: "Name",
                value: "_Счёт 50: Начальное значение(отн.ед.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f67"),
                column: "Name",
                value: "_Счёт 51: Начальное значение(отн.ед.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f68"),
                column: "Name",
                value: "_Счёт 60: Начальное значение(отн.ед.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f69"),
                column: "Name",
                value: "_Счёт 62: Начальное значение(отн.ед.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("eaacc9f3-a658-4218-ac77-3aefcf278c3d"),
                column: "Name",
                value: "_Счёт 10: Начальное значение(отн.ед.)");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f10"),
                column: "Name",
                value: "_Счёт 68: Начальное значение(руб.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f11"),
                column: "Name",
                value: "_Счёт 69: Начальное значение(руб.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f12"),
                column: "Name",
                value: "_Счёт 70: Начальное значение(руб.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f13"),
                column: "Name",
                value: "_Счёт 76: Начальное значение(руб.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f14"),
                column: "Name",
                value: "_Счёт 81: Начальное значение(руб.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f15"),
                column: "Name",
                value: "_Счёт 83: Начальное значение(руб.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f16"),
                column: "Name",
                value: "_Счёт 84: Начальное значение(руб.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f17"),
                column: "Name",
                value: "_Счёт 90: Начальное значение(руб.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f18"),
                column: "Name",
                value: "_Счёт 99: Начальное значение(руб.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f62"),
                column: "Name",
                value: "_Счёт 18: Начальное значение(руб.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f63"),
                column: "Name",
                value: "_Счёт 20: Начальное значение(руб.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f64"),
                column: "Name",
                value: "_Счёт 40: Начальное значение(руб.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f65"),
                column: "Name",
                value: "_Счёт 43: Начальное значение(руб.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f66"),
                column: "Name",
                value: "_Счёт 50: Начальное значение(руб.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f67"),
                column: "Name",
                value: "_Счёт 51: Начальное значение(руб.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f68"),
                column: "Name",
                value: "_Счёт 60: Начальное значение(руб.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("d6d2e616-39b5-4b16-8fdb-15e28d050f69"),
                column: "Name",
                value: "_Счёт 62: Начальное значение(руб.)");

            migrationBuilder.UpdateData(
                table: "RK_Accounts",
                keyColumn: "RkAccountId",
                keyValue: new Guid("eaacc9f3-a658-4218-ac77-3aefcf278c3d"),
                column: "Name",
                value: "_Счёт 10: Начальное значение(руб.)");
        }
    }
}
