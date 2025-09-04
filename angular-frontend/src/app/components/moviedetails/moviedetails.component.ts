import { Component, OnInit } from '@angular/core';
import { Showtime } from '../../Interfaces/showtime.model';
import { ActivatedRoute } from '@angular/router';
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
  theatres: string[] = [];
  times: string[] = [];
  showtimes:Showtime[] =[];

  selectedDate: string | null = null;
  selectedTheatre: string | null = null;
  selectedTime: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private showtimeService: ShowtimeService
  ) {}
  ngOnInit(): void {
    this.movieId = Number(this.route.snapshot.paramMap.get('id'));
    this.movie = this.movieService.getMovieById(this.movieId);
    this.showtimes = this.showtimeService.getShowtimesByMovie(this.movieId);
    this.dates = [...new Set(this.showtimes.map(s => s.date))];
    
    if (this.dates.length) {
      this.selectedDate = this.dates[0];
      this.updateTheatres();
    }
  }
  updateTheatres(): void {
  
    this.theatres = [
      ...new Set(this.showtimes.filter(s => s.date === this.selectedDate).map(s => s.theatre))
    ];
    this.selectedTheatre = this.theatres[0] || '';
    this.updateTimes();
  }

  updateTimes(): void {
    if (this.selectedDate && this.selectedTheatre) {
      const matches = this.showtimeService.getShowtimesByMovieDateAndTheatre(
        this.movieId,
        this.selectedDate,
        this.selectedTheatre
      );
      this.times = matches.length ? matches[0].times : [];
    } else {
      this.times = [];
    }
    this.selectedTime = '';
  }

  onDateChange(): void {
    this.selectedTheatre = '';
    this.selectedTime = '';
    this.updateTheatres();
  }

  onTheatreChange(): void {
    this.selectedTime = '';
    this.updateTimes();
  }

  chooseTime(time: string): void {
    this.selectedTime = time;
  }

  goToTickets(): void {
    
  }
}
