import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShowtimeService } from '../../Services/showtime.service';
import { MovieService } from '../../Services/movie.service';
import { Showtime } from '../../Interfaces/showtime.model';
import { Movie } from '../../Interfaces/movie.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seats.component.html',
  styleUrl: './seats.component.css'
})
export class SeatsComponent {
  showtimeId!: number;
  showtime!: Showtime | undefined;
  movie!: Movie | undefined;

  seats: any[] = [];
  selectedSeats: number[] = [];
  seatRows: any[][] = [];
  ticketprice:number =0;
  totalprice:number=0; 

  constructor(
    private route: ActivatedRoute,
    private showtimeService: ShowtimeService,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.showtimeId = Number(this.route.snapshot.paramMap.get('showtimeId'));
    this.showtime = this.showtimeService.getShowtimes().find(s => s.id === this.showtimeId);

    if (this.showtime) {
      this.movieService.getMovieById(this.showtime.movieId).subscribe(data => {
  this.movie = data;
});
      this.seats = this.showtimeService.getSeatsByHall(this.showtime.hallId, this.showtimeId);
      this.ticketprice = this.showtimeService.getHallPrice(this.showtime.hallId);
      const grouped : {[key:string]:any[]} = {};
      this.seats.forEach(seat => {
      if (!grouped[seat.row]) {
        grouped[seat.row] = [];
      }
      grouped[seat.row].push(seat);
      });
      this.seatRows = Object.values(grouped)
    }
  }

  toggleSeat(seatId: number): void {
    if (this.selectedSeats.includes(seatId)) {
      this.selectedSeats = this.selectedSeats.filter(s => s !== seatId);
    } else {
      this.selectedSeats.push(seatId);
    }
    this.totalprice = this.selectedSeats.length* this.ticketprice;
  }
}
