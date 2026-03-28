using System;
using System.Collections.Generic;
using System.Text;

namespace MovieTicket.Core.DTOs
{
    public class ReservationDTO
    {
        public int Id { get; set; }
        public int ShowtimeId { get; set; }
        public string MovieTitle { get; set; }
        public string Showtime { get; set; }
        public string CustomerName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public decimal TotalPrice { get; set; }
        public List<int> SelectedSeatIds { get; set; } = new List<int>();
        public string SelectedSeats { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; }
    }

    public class CreateReservationDTO
    {
        public int ShowtimeId { get; set; }
        public string CustomerName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public List<int> SelectedSeatIds { get; set; } = new List<int>();
        public decimal TotalPrice { get; set; }
    }
}
