import { Injectable } from '@angular/core';
import { Showtime } from '../Interfaces/showtime.model';

@Injectable({
  providedIn: 'root'
})
export class ShowtimeService {
   private showtimes: Showtime[] = [
    {
      id: 1,
      movieId: 1,
      theatre: 'Hall 1',
      date: '2025-09-12',
      times: ['11:30 AM', '03:00 PM', '06:45 PM']
    },
    {
      id: 2,
      movieId: 2,
      theatre: 'Hall 2',
      date: '2025-09-12',
      times: ['12:00 PM', '04:00 PM', '08:15 PM']
    },
    {
      id: 3,
      movieId: 1,
      theatre: 'Hall 1',
      date: '2025-09-13',
      times: ['01:00 PM', '05:00 PM']
    }
  ];
  constructor() { }
  getShowtimes(): Showtime[] {
    return this.showtimes;
  }

  getShowtimesByDateAndTheatre(date: string, theatre: string): Showtime[] {
    return this.showtimes.filter(s => s.date === date && s.theatre === theatre);
  }

  getShowtimesByMovie(movieId: number): Showtime[] {
    return this.showtimes.filter(s => s.movieId === movieId);
  }
}
