import { Component, OnInit } from '@angular/core';
import { Showtime } from '../../Interfaces/showtime.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../Services/movie.service';
import { ShowtimeService } from '../../Services/showtime.service';
import { Movie } from '../../Interfaces/movie.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-moviedetails',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './moviedetails.component.html',
  styleUrl: './moviedetails.component.css'
})
export class MoviedetailsComponent implements OnInit {
  movieId!: number;
  movie!: Movie | undefined;

  dates: string[] = [];
  halls: number[] = [];
  times: string[] = [];
  showtimes: Showtime[] = [];

  selectedDate: string | null = null;
  selectedHall: number | null = null;
  selectedTime: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router : Router,
    private movieService: MovieService,
    private showtimeService: ShowtimeService
  ) {}
  ngOnInit(): void {
    this.movieId = Number(this.route.snapshot.paramMap.get('id'));
    this.movieService.getMovieById(this.movieId).subscribe(data => {
    this.movie = data;
  }); 
    this.showtimes = this.showtimeService.getShowtimesByMovie(this.movieId);
    this.dates = [...new Set(this.showtimes.map(s => s.date))];
    
    if (this.dates.length) {
      this.selectedDate = this.dates[0];
      this.updateHalls();
    }
  }
  updateHalls(): void {
     this.halls = [
      ...new Set(
        this.showtimes
          .filter(s => s.date === this.selectedDate)
          .map(s => s.hallId)
      )
    ];
    this.selectedHall = this.halls[0] || null;
    this.updateTimes();
  }

  updateTimes(): void {
    if (this.selectedDate && this.selectedHall) {
      const matches = this.showtimeService.getShowtimesByMovieDateAndTheatre(
        this.movieId,
        this.selectedDate!,
        this.selectedHall!
      );
      this.times = matches.map(s => s.time); 
    } else {
      this.times = [];
    }
    this.selectedTime = '';
  }

  onDateChange(): void {
    this.selectedHall = null;
    this.selectedTime = '';
    this.updateHalls();
  }

  onHallChange(): void {
    this.selectedTime = '';
    this.updateTimes();
  }

  chooseTime(time: string): void {
    this.selectedTime = time;
  }

  goToTickets(): void {
    const match = this.showtimeService
    .getShowtimesByMovieDateAndTheatre(this.movieId, this.selectedDate!, this.selectedHall!)
      .find(s => s.time === this.selectedTime);
    
    if (!match) {
      alert('❌ Showtime not found.');
      return;
    }
  
    this.router.navigate(['/seats', match.id]);
  }
}  
