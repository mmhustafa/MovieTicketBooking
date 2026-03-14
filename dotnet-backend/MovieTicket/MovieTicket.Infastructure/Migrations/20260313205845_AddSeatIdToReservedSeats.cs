using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieTicket.Infastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSeatIdToReservedSeats : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SeatId",
                table: "ReservedSeats",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ReservedSeats_SeatId",
                table: "ReservedSeats",
                column: "SeatId");

            migrationBuilder.AddForeignKey(
                name: "FK_ReservedSeats_Seats_SeatId",
                table: "ReservedSeats",
                column: "SeatId",
                principalTable: "Seats",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReservedSeats_Seats_SeatId",
                table: "ReservedSeats");

            migrationBuilder.DropIndex(
                name: "IX_ReservedSeats_SeatId",
                table: "ReservedSeats");

            migrationBuilder.DropColumn(
                name: "SeatId",
                table: "ReservedSeats");
        }
    }
}
