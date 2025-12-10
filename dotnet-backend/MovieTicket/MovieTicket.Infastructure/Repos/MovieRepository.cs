using MovieTicket.Core.Interfaces;
using MovieTicket.Core.Models;
using MovieTicket.Infastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace MovieTicket.Infastructure.Repos
{
    public class MovieRepository : GenericRepository<Movie>, IMovieRepository
    {
        private readonly AppDbContext context;

        public MovieRepository(AppDbContext _context) : base(_context)
        {
            context = _context;
        }

        public IEnumerable<Movie> GetComingSoon()
        {
            return context.Movies.Where(m => m.Status == "ComingSoon").ToList();
        }

        public IEnumerable<Movie> GetNowShowing()
        {
            return context.Movies.Where(m => m.Status == "NowShowing").ToList();
        }
    }
}
