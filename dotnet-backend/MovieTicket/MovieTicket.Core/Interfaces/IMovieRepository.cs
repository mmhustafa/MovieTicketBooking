using MovieTicket.Core.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace MovieTicket.Core.Interfaces
{
    public interface IMovieRepository : IGenericRepository<Movie>
    {
        IEnumerable<Movie> GetNowShowing();
        IEnumerable<Movie> GetComingSoon();

    }
}
