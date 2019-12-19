using Microsoft.EntityFrameworkCore.Migrations;

namespace belsim2020.Database.Migrations
{
    public partial class AddExperimentName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "RK_Experiments",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "RK_Experiments");
        }
    }
}
