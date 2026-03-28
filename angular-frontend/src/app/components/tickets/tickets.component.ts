import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, AuthUser } from '../../Services/auth.service';
import { ReservationService, ReservationDTO } from '../../Services/reservation.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent implements OnInit, OnDestroy {
  userReservations: ReservationDTO[] = [];
  currentUser: AuthUser | null = null;
  isLoading = true;
  errorMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private reservationService: ReservationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get current user immediately
    this.currentUser = this.authService.getCurrentUser();
    const token = this.authService.getToken();
    const isAuthenticated = this.authService.isAuthenticated();
    
    console.log('=== 🎟️ TICKETS COMPONENT INIT ===');
    console.log('Current User:', this.currentUser);
    console.log('Token exists:', !!token);
    console.log('Is Authenticated:', isAuthenticated);
    console.log('Token length:', token ? token.length : 0);

    if (!this.currentUser || !token) {
      this.isLoading = false;
      this.errorMessage = 'Please login to view your reservations';
      console.log('⚠️ No user/token found - redirecting to /auth');
      setTimeout(() => this.router.navigate(['/auth']), 1500);
      return;
    }

    // Also subscribe to future changes
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });

    // Load reservations immediately
    this.loadUserReservations();
  }

  loadUserReservations(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const token = this.authService.getToken();
    console.log('=== 📡 LOADING RESERVATIONS ===');
    console.log('User:', this.currentUser?.name);
    console.log('Token available:', !!token);
    console.log('Calling: /api/reservations');

    this.reservationService.getReservations()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (reservations) => {
          console.log('✅ Reservations loaded successfully!');
          console.log('Count:', reservations.length);
          console.log('Data:', reservations);
          this.userReservations = reservations;
          this.isLoading = false;

          if (this.userReservations.length === 0) {
            this.errorMessage = 'No previous reservations found. Book your first ticket now!';
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error('❌ Error loading reservations:', err);
          console.error('Status:', err?.status);
          console.error('Status Text:', err?.statusText);
          console.error('Error Message:', err?.error?.message);
          
          // Extract detailed error message
          let errorMsg = 'Failed to load reservations';
          if (err?.error?.message) {
            errorMsg = err.error.message;
          } else if (err?.statusText) {
            errorMsg = err.statusText;
          } else if (err?.status === 401) {
            errorMsg = 'Unauthorized - Token may be expired. Please login again';
            setTimeout(() => this.router.navigate(['/auth']), 2000);
          } else if (err?.status === 0) {
            errorMsg = 'Network error - Is the backend running on localhost:5158?';
          } else if (err?.status === 500) {
            errorMsg = 'Server error - Backend returned an error';
          }
          
          this.errorMessage = errorMsg;
        }
      });
  }

  bookMore(): void {
    this.router.navigate(['/movies']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
