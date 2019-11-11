using Microsoft.EntityFrameworkCore.Migrations;

namespace belsim2020.Database.Migrations
{
    public partial class AddProjectOwnerFlag : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a47e2268-24ba-4296-8127-1a43f0e0b5a9");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "bb1ab920-d208-4cd9-99ec-00d8aaea272b");

            migrationBuilder.AddColumn<bool>(
                name: "IsProjectOwner",
                table: "UserProject",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Comments",
                table: "Projects",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OrganizationName",
                table: "Projects",
                nullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "6d987a38-d358-41f5-892b-f0bd6bc11c55", "ed794382-958f-4f96-9b53-b03fdfbab6a4", "admin", "ADMIN" },
                    { "b64bf53c-b02b-4b3c-8775-215cc60b2894", "cb3406a8-5916-4ae0-82b7-52356c0dda36", "user", "USER" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6d987a38-d358-41f5-892b-f0bd6bc11c55");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b64bf53c-b02b-4b3c-8775-215cc60b2894");

            migrationBuilder.DropColumn(
                name: "IsProjectOwner",
                table: "UserProject");

            migrationBuilder.DropColumn(
                name: "Comments",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "OrganizationName",
                table: "Projects");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "bb1ab920-d208-4cd9-99ec-00d8aaea272b", "8518cb19-c034-4ec1-84eb-5c6454f281b8", "admin", "ADMIN" },
                    { "a47e2268-24ba-4296-8127-1a43f0e0b5a9", "a779d541-931e-4763-a0b0-8de60b4dc9c6", "user", "USER" }
                });
        }
    }
}
