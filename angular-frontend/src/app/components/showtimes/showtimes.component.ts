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
  theatres: string[] = this.showtimeservice.getTheatres();
  selectedTheatre: string = this.theatres[0];

  dates: string[] = this.showtimeservice.getDates();
  selectedDate: string = this.dates[0];
  selectedTimes: { [showtimeId: number]: string } = {};

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
  selectTime(showtimeId: number, time: string) {
  this.selectedTimes[showtimeId] = time; 
}
}
