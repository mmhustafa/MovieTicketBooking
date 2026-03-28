import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReservationDTO {
  id?: number;
  showtimeId: number;
  movieTitle?: string;
  showtime?: string;
  customerName: string;
  email: string;
  phone: string;
  totalPrice: number;
  selectedSeatIds: number[];
  selectedSeats?: string;
  createdAt?: string;
  status?: string;
}

export interface CreateReservationDTO {
  showtimeId: number;
  customerName: string;
  email: string;
  phone: string;
  selectedSeatIds: number[];
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:5158/api/reservations';

  constructor(private http: HttpClient) { }

  /**
   * Create a new reservation
   */
  createReservation(reservation: CreateReservationDTO): Observable<ReservationDTO> {
    return this.http.post<ReservationDTO>(this.apiUrl, reservation);
  }

  /**
   * Get all reservations
   */
  getReservations(): Observable<ReservationDTO[]> {
    return this.http.get<ReservationDTO[]>(this.apiUrl);
  }

  /**
   * Get reservation by ID
   */
  getReservationById(id: number): Observable<ReservationDTO> {
    return this.http.get<ReservationDTO>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get hall price
   */
  getHallPrice(hallId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/halls/${hallId}/price`);
  }

  /**
   * Test authentication
   */
  testAuth(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/test`);
  }
}
