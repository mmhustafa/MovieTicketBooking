using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MovieTicket.Core.Interfaces;

namespace MovieTicket.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly IUnitofWork unitofwork;

        public MoviesController(IUnitofWork unitofwork)
        {
            this.unitofwork = unitofwork;
        }
        [HttpGet("all")]
        public IActionResult GetALl()
        {
            var movies =  unitofwork.MovieRepository.GetAll();
            return Ok(movies);
        }
        [HttpGet]
        public IActionResult GetMovies(
            [FromQuery] string? status,
            [FromQuery] string? search,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 8)
        {
            var movies = unitofwork.MovieRepository.GetAll();

            if (!string.IsNullOrEmpty(status) && status != "All")
                movies = movies.Where(m => m.Status == status);

            if (!string.IsNullOrEmpty(search))
                movies = movies.Where(m => m.Title.Contains(search, StringComparison.OrdinalIgnoreCase));

            var totalMovies = movies.Count();
            var totalPages = (int)Math.Ceiling(totalMovies / (double)pageSize);

            var pagedMovies = movies
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return Ok(new
            {
                data = pagedMovies,
                currentPage = page,
                totalPages = totalPages,
                pageSize = pageSize,
                totalMovies = totalMovies
            });
        }

        [HttpGet("{id}")]
        public IActionResult GetMovieById(int id)
        {
            var movie = unitofwork.MovieRepository.GetFirstorDefault(m => m.Id == id);

            if (movie == null)
                return NotFound();

            return Ok(movie);
        }

        [HttpGet("now-showing")]
        public IActionResult GetNowShowing()
        {
            var movies = unitofwork.MovieRepository.GetNowShowing();
            return Ok(movies);
        }

        [HttpGet("coming-soon")]
        public IActionResult GetComingSoon()
        {
            var movies = unitofwork.MovieRepository.GetComingSoon();
            return Ok(movies);
        }

    }
}
