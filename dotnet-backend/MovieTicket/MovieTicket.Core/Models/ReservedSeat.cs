namespace MovieTicket.Core.Models
{
    public class ReservedSeat
    {
        public int Id { get; set; }
        public int ReservationId { get; set; }

        public Reservation Reservation { get; set; }
    }
}