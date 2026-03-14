using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MovieTicket.Core.Interfaces;
using MovieTicket.Core.Models;

namespace MovieTicket.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShowtimesController : ControllerBase
    {
        private readonly IUnitofWork unitofwork;

        public ShowtimesController(IUnitofWork unitofwork)
        {
            this.unitofwork = unitofwork;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Showtime>> GetShowtimes(
           int? movieId = null,
           string? date = null,
           int? hallId = null)
        {
            var showtimes = unitofwork.ShowtimeRepository.GetAll(s =>
                (!movieId.HasValue || s.MovieId == movieId.Value) &&
                (string.IsNullOrEmpty(date) || s.Date == date) &&
                (!hallId.HasValue || s.HallId == hallId.Value),
                "Movie,Hall" 
            );

            return Ok(showtimes);
        }

        [HttpGet("theatres")]
        public ActionResult<IEnumerable<int>> GetTheatres()
        {
            var theaters = unitofwork.ShowtimeRepository.GetTheatres();
            return Ok(theaters);
        }

        [HttpGet("dates")]
        public ActionResult<IEnumerable<string>> GetDates()
        {
            var dates = unitofwork.ShowtimeRepository.GetDates();
            return Ok(dates);
        }

        [HttpGet("{showtimeId}/seats")]
        public ActionResult<IEnumerable<object>> GetSeats(int showtimeId, [FromQuery] int hallId)
        {
            var seats = unitofwork.ShowtimeRepository.GetSeatsWithStatus(showtimeId, hallId);
            return Ok(seats);
        }
    }
}
