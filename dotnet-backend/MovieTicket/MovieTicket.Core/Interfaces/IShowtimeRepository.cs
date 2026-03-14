using MovieTicket.Core.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace MovieTicket.Core.Interfaces
{
    public interface IShowtimeRepository : IGenericRepository<Showtime>
    {
        IEnumerable<int> GetTheatres();
        IEnumerable<string> GetDates();
        IEnumerable<object> GetSeatsWithStatus(int showtimeId, int hallId);
    }
}
