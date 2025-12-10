using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace MovieTicket.Core.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        IEnumerable<T> GetAll(Expression<Func<T, bool>>? predicate = null, string? includeword = null);
        T GetFirstorDefault(Expression<Func<T, bool>>? predicate = null, string? includedTable = null);
        void Add(T obj);
        void Update(T obj);
        void Delete(T obj);
    }
}
