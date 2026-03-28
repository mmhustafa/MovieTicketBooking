using MovieTicket.Core.Interfaces;
using MovieTicket.Core.Models;
using MovieTicket.Infastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace MovieTicket.Infastructure.Repos
{
    public class UnitofWork : IUnitofWork
    {
        private readonly AppDbContext context;
        public IMovieRepository MovieRepository { get; set; }
        public IShowtimeRepository ShowtimeRepository { get; set; }
        public IGenericRepository<Hall> HallRepository { get; set; }
        public IGenericRepository<Reservation> ReservationRepository { get; set; }
        public IGenericRepository<ReservedSeat> ReservedSeatRepository { get; set; }
        public IGenericRepository<Seat> SeatRepository { get; set; }

        public UnitofWork(AppDbContext _context, 
            IMovieRepository movieRepository, 
            IShowtimeRepository showtimeRepository,
            IGenericRepository<Hall> hallRepository,
            IGenericRepository<Reservation> reservationRepository,
            IGenericRepository<ReservedSeat> reservedSeatRepository,
            IGenericRepository<Seat> seatRepository)
        {
            this.context = _context;
            MovieRepository = movieRepository;
            ShowtimeRepository = showtimeRepository;
            HallRepository = hallRepository;
            ReservationRepository = reservationRepository;
            ReservedSeatRepository = reservedSeatRepository;
            SeatRepository = seatRepository;
        }

        public int Complete()
        {
            return context.SaveChanges();
        }

        public void Save()
        {
            context.SaveChanges();
        }

        public void Dispose()
        {
            context.Dispose();
        }
    }
}
