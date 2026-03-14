using Microsoft.EntityFrameworkCore;
using MovieTicket.Core.Interfaces;
using MovieTicket.Core.Models;
using MovieTicket.Infastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace MovieTicket.Infastructure.Repos
{
    public class ShowtimeRepository : GenericRepository<Showtime>, IShowtimeRepository
    {
        private readonly AppDbContext _context;
        public ShowtimeRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        IEnumerable<string> IShowtimeRepository.GetDates()
        {
            return _context.Showtimes
                           .Select(s => s.Date)
                           .Distinct()
                           .OrderBy(d => d)
                           .ToList();
        }

        IEnumerable<object> IShowtimeRepository.GetSeatsWithStatus(int showtimeId, int hallId)
        {
            var hallSeats = _context.Seats
               .Where(s => s.HallId == hallId)
               .ToList();

     
            var reservedSeats = _context.Reservations
                .Where(r => r.ShowtimeId == showtimeId)
                .SelectMany(r => r.ReservedSeats)
                .Select(rs => rs.SeatId)
                .ToHashSet();

          
            var seatsWithStatus = hallSeats.Select(s => new
            {
                s.Id,
                s.Row,
                s.Number,
                Reserved = reservedSeats.Contains(s.Id)
            });

            return seatsWithStatus;
        }

        IEnumerable<int> IShowtimeRepository.GetTheatres()
        {
            return _context.Showtimes
                           .Select(s => s.HallId)
                           .Distinct()
                           .OrderBy(h => h)
                           .ToList();
        }

    }
}
