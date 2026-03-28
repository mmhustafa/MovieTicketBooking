using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MovieTicket.Core.DTOs;
using MovieTicket.Core.Interfaces;
using MovieTicket.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;

namespace MovieTicket.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private readonly IUnitofWork unitofwork;

        public ReservationsController(IUnitofWork unitofwork)
        {
            this.unitofwork = unitofwork;
        }

        /// <summary>
        /// Get all reservations (for authenticated users)
        /// </summary>
        [HttpGet]
        [Authorize]
        public ActionResult<IEnumerable<ReservationDTO>> GetReservations()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User ID not found in token");

            // Get only current user's reservations
            var reservations = unitofwork.ReservationRepository.GetAll(r => r.UserId == userId, "Showtime,Showtime.Movie,Showtime.Hall,ReservedSeats,ReservedSeats.Seat");
            
            var reservationDTOs = reservations.Select(r => new ReservationDTO
            {
                Id = r.Id,
                ShowtimeId = r.ShowtimeId,
                MovieTitle = r.Showtime?.Movie?.Title ?? "N/A",
                Showtime = $"{r.Showtime?.Date} at {r.Showtime?.Time}" ?? "N/A",
                CustomerName = r.User?.UserName ?? "N/A",
                Email = r.User?.Email ?? "N/A",
                Phone = r.User?.PhoneNumber ?? "N/A",
                SelectedSeatIds = r.ReservedSeats.Select(rs => rs.SeatId).ToList(),
                SelectedSeats = string.Join(" - ", r.ReservedSeats.Select(rs => $"{rs.Seat?.Row}{rs.Seat?.Number}")),
                TotalPrice = r.ReservedSeats.Count() * (r.Showtime?.Hall?.TicketPrice ?? 0),
                CreatedAt = r.CreatedAt,
                Status = "Confirmed"
            }).ToList();

            return Ok(reservationDTOs);
        }

        /// <summary>
        /// Get reservation by ID (for authenticated users)
        /// </summary>
        [HttpGet("{id}")]
        [Authorize]
        public ActionResult<ReservationDTO> GetReservation(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User ID not found in token");

            var reservation = unitofwork.ReservationRepository.GetFirstorDefault(r => r.Id == id && r.UserId == userId, "Showtime,Showtime.Movie,Showtime.Hall,ReservedSeats,ReservedSeats.Seat");
            
            if (reservation == null)
                return NotFound("Reservation not found");

            var reservationDTO = new ReservationDTO
            {
                Id = reservation.Id,
                ShowtimeId = reservation.ShowtimeId,
                MovieTitle = reservation.Showtime?.Movie?.Title ?? "N/A",
                Showtime = $"{reservation.Showtime?.Date} at {reservation.Showtime?.Time}" ?? "N/A",
                CustomerName = reservation.User?.UserName ?? "N/A",
                Email = reservation.User?.Email ?? "N/A",
                Phone = reservation.User?.PhoneNumber ?? "N/A",
                SelectedSeatIds = reservation.ReservedSeats.Select(rs => rs.SeatId).ToList(),
                SelectedSeats = string.Join(" - ", reservation.ReservedSeats.Select(rs => $"{rs.Seat?.Row}{rs.Seat?.Number}")),
                TotalPrice = reservation.ReservedSeats.Count() * (reservation.Showtime?.Hall?.TicketPrice ?? 0),
                CreatedAt = reservation.CreatedAt,
                Status = "Confirmed"
            };

            return Ok(reservationDTO);
        }

        /// <summary>
        /// Create new reservation (Authenticated users only)
        /// </summary>
        [HttpPost]
        [Authorize]
        public ActionResult<ReservationDTO> CreateReservation([FromBody] CreateReservationDTO createReservationDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Get authenticated user ID from JWT token
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User ID not found in token");

            // Validate showtime exists
            var showtime = unitofwork.ShowtimeRepository.GetFirstorDefault(s => s.Id == createReservationDTO.ShowtimeId, "Movie,Hall");
            if (showtime == null)
                return BadRequest("Invalid showtime");

            // Validate seats exist and are available
            var seats = unitofwork.SeatRepository.GetAll(s => 
                createReservationDTO.SelectedSeatIds.Contains(s.Id) && s.HallId == showtime.HallId);
            
            if (seats.Count() != createReservationDTO.SelectedSeatIds.Count)
                return BadRequest("One or more seats are invalid");

            // Check if seats are already reserved for this showtime
            var reservedSeats = unitofwork.ReservedSeatRepository.GetAll(rs =>
                createReservationDTO.SelectedSeatIds.Contains(rs.SeatId) && rs.Reservation.ShowtimeId == createReservationDTO.ShowtimeId);
            
            if (reservedSeats.Any())
                return BadRequest("One or more seats are already reserved");

            try
            {
                // Create reservation with authenticated user's ID
                var reservation = new Reservation
                {
                    ShowtimeId = createReservationDTO.ShowtimeId,
                    UserId = userId, // Set from authenticated user
                    CreatedAt = DateTime.Now
                };

                unitofwork.ReservationRepository.Add(reservation);
                unitofwork.Save();

                // Create reserved seats
                foreach (var seatId in createReservationDTO.SelectedSeatIds)
                {
                    var reservedSeat = new ReservedSeat
                    {
                        ReservationId = reservation.Id,
                        SeatId = seatId
                    };
                    unitofwork.ReservedSeatRepository.Add(reservedSeat);
                }

                unitofwork.Save();

                // Prepare response
                var reservationDTO = new ReservationDTO
                {
                    Id = reservation.Id,
                    ShowtimeId = reservation.ShowtimeId,
                    MovieTitle = showtime.Movie?.Title ?? "N/A",
                    Showtime = $"{showtime.Date} at {showtime.Time}",
                    CustomerName = createReservationDTO.CustomerName,
                    Email = createReservationDTO.Email,
                    Phone = createReservationDTO.Phone,
                    SelectedSeatIds = createReservationDTO.SelectedSeatIds,
                    SelectedSeats = string.Join(" - ", seats.Select(s => $"{s.Row}{s.Number}")),
                    TotalPrice = createReservationDTO.TotalPrice,
                    CreatedAt = reservation.CreatedAt,
                    Status = "Confirmed"
                };

                return CreatedAtAction(nameof(GetReservation), new { id = reservation.Id }, reservationDTO);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error creating reservation: {ex.Message}");
            }
        }

        /// <summary>
        /// Get hall price
        /// </summary>
        [HttpGet("halls/{hallId}/price")]
        public ActionResult<int> GetHallPrice(int hallId)
        {
            var hall = unitofwork.HallRepository.GetFirstorDefault(h => h.Id == hallId);
            if (hall == null)
                return NotFound("Hall not found");

            return Ok(hall.TicketPrice);
        }

        /// <summary>
        /// Test endpoint to verify authentication
        /// </summary>
        [HttpGet("test")]
        [Authorize]
        public ActionResult<object> TestAuth()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userName = User.FindFirst(ClaimTypes.Name)?.Value;
            
            return Ok(new { userId, userName, message = "Authentication successful" });
        }
    }
}
