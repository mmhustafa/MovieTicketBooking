using System;
using System.Collections.Generic;
using System.Text;

namespace MovieTicket.Core.Interfaces
{
    public interface IUnitofWork : IDisposable
    {
        IMovieRepository MovieRepository { get; }
        IShowtimeRepository ShowtimeRepository { get; }
        IGenericRepository<Core.Models.Hall> HallRepository { get; }
        IGenericRepository<Core.Models.Reservation> ReservationRepository { get; }
        IGenericRepository<Core.Models.ReservedSeat> ReservedSeatRepository { get; }
        IGenericRepository<Core.Models.Seat> SeatRepository { get; }
        int Complete();
        void Save();
    }
}
