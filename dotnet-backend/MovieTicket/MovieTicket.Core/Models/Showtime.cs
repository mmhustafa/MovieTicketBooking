using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace MovieTicket.Core.Models
{
    public class Showtime
    {
        public int Id { get; set; }
        public int MovieId { get; set; }
        public int HallId { get; set; }
        public string Date { get; set; }
        public string Time { get; set; }

        [JsonIgnore]
        public Movie Movie { get; set; }
        [JsonIgnore]
        public Hall Hall { get; set; }
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}
