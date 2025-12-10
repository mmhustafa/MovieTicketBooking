using MovieTicket.Core.Interfaces;
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

        public UnitofWork(AppDbContext _context, IMovieRepository movieRepository)
        {
            this.context = _context;
            MovieRepository = movieRepository;
        }

        public int Complete()
        {
            return context.SaveChanges();
        }

        public void Dispose()
        {
            context.Dispose();
        }
    }
}
