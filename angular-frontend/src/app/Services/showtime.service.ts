import { Injectable } from '@angular/core';
import { Showtime } from '../Interfaces/showtime.model';
import { Hall } from '../Interfaces/hall.model';
import { Seat } from '../Interfaces/seat.model';
import { Reservation } from '../Interfaces/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ShowtimeService {

  // ✅ Halls
  private halls: Hall[] = [
    { id: 1, name: 'Hall 1', capacity: 180, rows: 10, seatsPerRow: 18 },
    { id: 2, name: 'Hall 2', capacity: 30, rows: 5, seatsPerRow: 6 }
  ];

  // ✅ Showtimes
  private showtimes: Showtime[] = [
    { id: 1, movieId: 1, hallId: '1', date: '2025-09-13', time: '11:30 AM' },
    { id: 2, movieId: 1, hallId: '1', date: '2025-09-13', time: '06:00 PM' },
    { id: 3, movieId: 2, hallId: '2', date: '2025-09-14', time: '04:00 PM' }
  ];

  // ✅ Seats (Static build for halls)
  private seats: Seat[] = [];

  // ✅ Reservations
  private reservations: Reservation[] = [
    {
      id: 1,
      userId: 101,
      showtimeId: 1,
      createdAt: new Date().toISOString(),
      seats: [
        { seatId: 5, reservationId: 1 },
        { seatId: 6, reservationId: 1 }
      ]
    },
    {
      id: 2,
      userId: 102,
      showtimeId: 2,
      createdAt: new Date().toISOString(),
      seats: [
        { seatId: 10, reservationId: 2 }
      ]
    }
  ];

  constructor() {
    // generate seats based on halls
    this.halls.forEach(hall => {
      for (let r = 0; r < hall.rows; r++) {
        const rowLetter = String.fromCharCode(65 + r); // A, B, C...
        for (let n = 1; n <= hall.seatsPerRow; n++) {
          this.seats.push({
            id: this.seats.length + 1,
            hallId: hall.id,
            row: rowLetter,
            number: n
          });
        }
      }
    });
  }

  // === Keep your original methods ===
  getShowtimes(): Showtime[] {
    return this.showtimes;
  }

  getTheatres(): string[] {
    return [...new Set(this.showtimes.map(s => s.hallId))];
  }

  getDates(): string[] {
    return [...new Set(this.showtimes.map(s => s.date))];
  }

  getShowtimesByDateAndTheatre(date: string, theatre: string): Showtime[] {
    return this.showtimes.filter(s => s.date === date && s.hallId === theatre);
  }

  getShowtimesByMovieDateAndTheatre(movieId: number, date: string, theatre: string): Showtime[] {
    return this.showtimes.filter(
      s => s.movieId === movieId && s.date === date && s.hallId === theatre
    );
  }

  getShowtimesByMovie(movieId: number): Showtime[] {
    return this.showtimes.filter(s => s.movieId === movieId);
  }
  getSeatsByHall(hallId: string, showtimeId: number): any[] {
  const hallSeats = this.seats.filter(s => s.hallId === +hallId);

  const reservedSeats = this.reservations
    .filter(r => r.showtimeId === showtimeId)
    .flatMap(r => r.seats.map(seat => seat.seatId));

  return hallSeats.map(s => ({
    ...s,
    reserved: reservedSeats.includes(s.id)
  }));
 }

}
