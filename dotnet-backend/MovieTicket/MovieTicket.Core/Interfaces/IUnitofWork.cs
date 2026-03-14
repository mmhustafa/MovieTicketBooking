using System;
using System.Collections.Generic;
using System.Text;

namespace MovieTicket.Core.Interfaces
{
    public interface IUnitofWork : IDisposable
    {
        IMovieRepository MovieRepository { get; }
        IShowtimeRepository ShowtimeRepository { get; }
        int Complete();
    }
}
