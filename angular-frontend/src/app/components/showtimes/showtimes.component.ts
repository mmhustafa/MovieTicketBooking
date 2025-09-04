import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../Services/movie.service';
import { ShowtimeService } from '../../Services/showtime.service';
import { CommonModule } from '@angular/common';
import { Showtime } from '../../Interfaces/showtime.model';
import { Movie } from '../../Interfaces/movie.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-showtimes',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './showtimes.component.html',
  styleUrl: './showtimes.component.css'
})
export class ShowtimesComponent implements OnInit {
  theatres: string[] = ['Hall 1', 'Hall 2', 'Hall 3'];
  selectedTheatre: string = this.theatres[0];

  dates: string[] = ['2025-09-12', '2025-09-13', '2025-09-14'];
  selectedDate: string = this.dates[0];

  showtimes: Showtime[] = [];
  movies: Movie[] = [];

  ngOnInit(): void {
    this.movies = this.movieservice.getMovies();
    this.loadShowtimes();
  }
  constructor(
    private movieservice : MovieService,
    private showtimeservice : ShowtimeService
  ) {}
  loadShowtimes() {
    this.showtimes = this.showtimeservice.getShowtimesByDateAndTheatre(
      this.selectedDate,
      this.selectedTheatre
    );
  }

  getMovie(movieId: number): Movie | undefined {
    return this.movies.find(m => m.id === movieId);
  }
}
