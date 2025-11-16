using System;

namespace MovieTicket.Core.Models
{
    public class Showtime
    {
        public int Id { get; set; }
        public int MovieId { get; set; }
        public int HallId { get; set; }
        public string Date { get; set; }
        public string Time { get; set; }

        
        public Movie Movie { get; set; }
        public Hall Hall { get; set; }
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}