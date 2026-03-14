import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../Services/movie.service';
import { ShowtimeService } from '../../Services/showtime.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Showtime } from '../../Interfaces/showtime.model';
import { Movie } from '../../Interfaces/movie.model';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

interface GroupedShowtime {
  movieId: number;
  times: string[];
}

@Component({
  selector: 'app-showtimes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './showtimes.component.html',
  styleUrl: './showtimes.component.css'
})
export class ShowtimesComponent implements OnInit {
  halls: number[] = [];
  dates: string[] = [];
  movies: Movie[] = [];
  showtimes: GroupedShowtime[] = [];
  selectedHall: number | null = null;
  selectedDate: string = '';
  selectedTimes: { [movieId: number]: string } = {};
  constructor(
    private movieservice: MovieService,
    private showtimeservice: ShowtimeService
  ) {}

  // ngOnInit(): void {
    
  //   // this.movieservice.getMovies().subscribe(data => {
  //   //   this.movies = data;
  //   // });


  //   // this.showtimeservice.getTheatres().subscribe(data => {
  //   //   this.halls = data;
  //   //   this.selectedHall = this.halls.length ? this.halls[0] : null;
  //   //   this.tryLoadShowtimes();
  //   // });

  //   // this.showtimeservice.getDates().subscribe(data => {
  //   //   this.dates = data;
  //   //   this.selectedDate = this.dates.length ? this.dates[0] : '';
  //   //   this.tryLoadShowtimes();
  //   // });
    
  // }
ngOnInit(): void {
  forkJoin({
    movies: this.movieservice.getallMovies(),
    halls: this.showtimeservice.getTheatres(),
    dates: this.showtimeservice.getDates()
  }).subscribe(({ movies, halls, dates }) => {
    this.movies = movies;
    this.halls = halls;
    this.dates = dates;

    this.selectedHall = halls.length ? halls[0] : null;
    this.selectedDate = dates.length ? dates[0] : '';

    this.loadShowtimes();
  });
}

 loadShowtimes(): void {
  
  if (!this.selectedDate || this.selectedHall === null) return;

  this.showtimeservice
    .getShowtimesByDateAndTheatre(this.selectedDate, this.selectedHall)
    .subscribe((rawShowtimes: Showtime[]) => { 
      const grouped: { [movieId: number]: string[] } = {};
      rawShowtimes.forEach((s: Showtime) => {  
        if (!grouped[s.movieId]) grouped[s.movieId] = [];
        grouped[s.movieId].push(s.time);
      });

      this.showtimes = Object.keys(grouped).map(movieId => ({
        movieId: Number(movieId),
        times: grouped[Number(movieId)]
      }));
    });
}

  getMovie(movieId: number): Movie | undefined {
    const movie = this.movies.find(m => m.id === movieId);
    return movie;
  }

  selectTime(movieId: number, time: string): void {
    this.selectedTimes[movieId] = time;
  }
}