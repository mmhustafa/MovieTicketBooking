import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShowtimeService } from '../../Services/showtime.service';
import { MovieService } from '../../Services/movie.service';
import { Showtime } from '../../Interfaces/showtime.model';
import { Movie } from '../../Interfaces/movie.model';
import { Hall } from '../../Interfaces/hall.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seats.component.html',
  styleUrl: './seats.component.css'
})
export class SeatsComponent implements OnInit {
  showtimeId!: number;
  showtime!: Showtime | undefined;
  movie!: Movie | undefined;
  hall!: Hall | undefined;

  seats: any[] = [];
  selectedSeats: number[] = [];
  seatRows: any[][] = [];
  ticketprice: number = 0;
  totalprice: number = 0;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private showtimeService: ShowtimeService,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.showtimeId = Number(this.route.snapshot.paramMap.get('showtimeId'));

    this.showtimeService.getShowtimes().subscribe(showtimes => {
      this.showtime = showtimes.find(s => s.id === this.showtimeId);

      if (!this.showtime) {
        alert('Showtime not found');
        this.router.navigate(['/showtimes']);
        return;
      }

      // Get movie details
      this.movieService.getMovieById(this.showtime.movieId).subscribe(data => {
        this.movie = data;
      });

      // Get seats for the hall
      this.showtimeService.getSeatsByHall(this.showtime.hallId, this.showtimeId)
        .subscribe(seats => {
          this.seats = seats;

          const grouped: { [key: string]: any[] } = {};
          this.seats.forEach(seat => {
            if (!grouped[seat.row]) grouped[seat.row] = [];
            grouped[seat.row].push(seat);
          });
          this.seatRows = Object.values(grouped);
          this.isLoading = false;
        });

      // Get hall price from Hall interface
      // The Hall interface contains the ticketprice property
      this.showtimeService.getHallPrice(this.showtime.hallId).subscribe(price => {
        this.ticketprice = price;
      });
    });
  }

  toggleSeat(seatId: number): void {
    if (this.selectedSeats.includes(seatId)) {
      this.selectedSeats = this.selectedSeats.filter(s => s !== seatId);
    } else {
      this.selectedSeats.push(seatId);
    }
    this.totalprice = this.selectedSeats.length * this.ticketprice;
  }

  /**
   * Get seat name from seat ID
   */
  getSeatName(seatId: number): string {
    const seat = this.seats.find(s => s.id === seatId);
    if (seat) {
      return `${seat.row}${seat.number}`;
    }
    return '';
  }

  /**
   * Get formatted selected seat names
   */
  getSelectedSeatNames(): string {
    const seatNames = this.selectedSeats
      .map(seatId => this.getSeatName(seatId))
      .filter(name => name !== '');
    return seatNames.join(' - ');
  }

  confirmSelection(): void {
    if (this.selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    // Store reservation data in session storage
    const reservationData = {
      customerName: '',
      email: '',
      phone: '',
      movieTitle: this.movie?.title || '',
      showtime: `${this.showtime?.date} at ${this.showtime?.time}`,
      selectedSeats: this.getSelectedSeatNames(),
      selectedSeatIds: this.selectedSeats,
      totalPrice: this.totalprice,
      reservationStatus: 'Pending',
      showtimeId: this.showtimeId,
      hallId: this.showtime?.hallId,
      hallName: this.hall?.name || ''
    };

    sessionStorage.setItem('reservationData', JSON.stringify(reservationData));
    // Navigate to authentication/reservation flow
    this.router.navigate(['/reservation']);
  }
}