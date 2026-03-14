  import { Injectable } from '@angular/core';
  import { Showtime } from '../Interfaces/showtime.model';
  import { HttpClient } from '@angular/common/http';
  import { Hall } from '../Interfaces/hall.model';
  import { Seat } from '../Interfaces/seat.model';
  import { Reservation } from '../Interfaces/reservation.model';
  import { Observable } from 'rxjs';

  @Injectable({
    providedIn: 'root'
  })
  export class ShowtimeService {

    constructor(private http: HttpClient) { }

    private apiUrl = 'http://localhost:5158/api/showtimes';
    getShowtimes(): Observable<Showtime[]> {
      return this.http.get<Showtime[]>(this.apiUrl);
    }

    getTheatres(): Observable<number[]> {
      return this.http.get<number[]>(`${this.apiUrl}/theatres`);
    }

    getDates(): Observable<string[]> {
      return this.http.get<string[]>(`${this.apiUrl}/dates`);
    }

    getShowtimesByDateAndTheatre(date: string, theatre: number): Observable<Showtime[]> {
      return this.http.get<Showtime[]>(`${this.apiUrl}?date=${date}&hallId=${theatre}`);
    }

    getShowtimesByMovieDateAndTheatre(movieId: number, date: string, theatre: number): Observable<Showtime[]> {
      return this.http.get<Showtime[]>(`${this.apiUrl}?movieId=${movieId}&date=${date}&hallId=${theatre}`);
    }
    
    getShowtimesByMovie(movieId: number): Observable<Showtime[]> {
      return this.http.get<Showtime[]>(`${this.apiUrl}?movieId=${movieId}`);
    }

    getSeatsByHall(hallId: number, showtimeId: number): Observable<Seat[]> {
      return this.http.get<Seat[]>(`${this.apiUrl}/${showtimeId}/seats?hallId=${hallId}`);
    }
    getHallPrice(hallId: number): Observable<number> {
      return this.http.get<number>(`https://localhost:5001/api/halls/${hallId}/price`);
    }

  }
