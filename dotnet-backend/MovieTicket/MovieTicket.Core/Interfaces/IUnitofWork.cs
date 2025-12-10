using System;
using System.Collections.Generic;
using System.Text;

namespace MovieTicket.Core.Interfaces
{
    public interface IUnitofWork : IDisposable
    {
        IMovieRepository MovieRepository { get; }
        int Complete();
    }
}
