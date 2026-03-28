import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, AuthUser } from '../../Services/auth.service';
import { ReservationService, CreateReservationDTO } from '../../Services/reservation.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent implements OnInit {
  reservations: any[] = [];
  selectedReservation: any = null;
  currentUser: AuthUser | null = null;
  isSubmitting = false;
  submissionError = '';
  submissionSuccess = '';

  reservationDetails = {
    customerName: '',
    email: '',
    phone: '',
    movieTitle: '',
    showtime: '',
    selectedSeats: '',
    selectedSeatIds: [] as number[],
    totalPrice: 0,
    reservationStatus: 'Pending',
    showtimeId: 0
  };

  constructor(
    private router: Router, 
    private authService: AuthService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    // Load current user and reservations
    this.currentUser = this.authService.getCurrentUser();
    this.loadReservations();
  }

  loadReservations(): void {
    // Load from session storage
    const stored = sessionStorage.getItem('reservationData');
    if (stored) {
      this.reservationDetails = JSON.parse(stored);
    }

    // Pre-fill user information from authenticated user
    if (this.currentUser) {
      this.reservationDetails.customerName = this.currentUser.name;
      this.reservationDetails.email = this.currentUser.email;
      this.reservationDetails.phone = this.currentUser.phone;
    }
  }

  submitReservation(): void {
    if (this.validateForm()) {
      this.isSubmitting = true;
      this.submissionError = '';

      // Update user info if fields changed
      if (this.currentUser) {
        this.currentUser.name = this.reservationDetails.customerName;
        this.currentUser.email = this.reservationDetails.email;
        this.currentUser.phone = this.reservationDetails.phone;
        this.authService.updateUser(this.currentUser);
      }

      // Create reservation DTO
      const createReservationDTO: CreateReservationDTO = {
        showtimeId: this.reservationDetails.showtimeId,
        customerName: this.reservationDetails.customerName,
        email: this.reservationDetails.email,
        phone: this.reservationDetails.phone,
        selectedSeatIds: this.reservationDetails.selectedSeatIds,
        totalPrice: this.reservationDetails.totalPrice
      };

      // Submit to backend
      this.reservationService.createReservation(createReservationDTO).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.submissionSuccess = `Reservation confirmed! Confirmation #${response.id} has been sent to ${response.email}`;
          
          // Clear session storage
          sessionStorage.removeItem('reservationData');
          
          // Redirect after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        },
        error: (error) => {
          this.isSubmitting = false;
          const errorMsg = error?.error?.message || error?.error || 'Failed to create reservation. Please try again.';
          this.submissionError = errorMsg;
          console.error('Reservation error:', error);
        }
      });
    }
  }

  validateForm(): boolean {
    if (!this.reservationDetails.customerName || 
        !this.reservationDetails.email || 
        !this.reservationDetails.phone) {
      this.submissionError = 'Please fill in all required fields';
      return false;
    }
    return true;
  }

  goBack(): void {
    this.router.navigate(['/seats']);
  }

  cancelReservation(): void {
    if (confirm('Are you sure you want to cancel this reservation?')) {
      sessionStorage.removeItem('reservationData');
      this.router.navigate(['/']);
    }
  }
}
