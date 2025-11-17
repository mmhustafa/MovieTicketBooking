using System;
using System.Collections.Generic;
using System.Text;

namespace MovieTicket.Core.Models
{
    public class Reservation
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int ShowtimeId { get; set; }
        public DateTime CreatedAt { get; set; }

        public ApplicationUser User { get; set; }
        public Showtime Showtime { get; set; }
        public ICollection<ReservedSeat> ReservedSeats { get; set; } = new List<ReservedSeat>();
    }
}
