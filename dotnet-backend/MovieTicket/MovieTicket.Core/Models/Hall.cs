using System;
using System.Collections.Generic;
using System.Text;

namespace MovieTicket.Core.Models
{
    public class Hall
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Capacity { get; set; }
        public int TicketPrice { get; set; }
        public int SeatsPerRow { get; set; }
        public int Rows { get; set; }

        public ICollection<Seat> Seats { get; set; } = new List<Seat>();
        public ICollection<Showtime> Showtimes { get; set; } = new List<Showtime>();

    }
}
