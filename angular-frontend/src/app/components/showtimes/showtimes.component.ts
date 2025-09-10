// import { Component, OnInit } from '@angular/core';
// import { MovieService } from '../../Services/movie.service';
// import { ShowtimeService } from '../../Services/showtime.service';
// import { CommonModule } from '@angular/common';
// import { Showtime } from '../../Interfaces/showtime.model';
// import { Movie } from '../../Interfaces/movie.model';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-showtimes',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './showtimes.component.html',
//   styleUrl: './showtimes.component.css'
// })
// export class ShowtimesComponent implements OnInit {
//   halls: string[] = [];
//   selectedHall: string = '';

//   dates: string[] = [];
//   selectedDate: string = '';

//   selectedTimes: { [showtimeId: number]: string } = {};

//   showtimes: Showtime[] = [];
//   movies: Movie[] = [];

//   constructor(
//     private movieservice: MovieService,
//     private showtimeservice: ShowtimeService
//   ) {}

//   ngOnInit(): void {
//     this.movies = this.movieservice.getMovies();
//     this.halls = this.showtimeservice.getTheatres(); 
//     this.dates = this.showtimeservice.getDates();

//     this.selectedHall = this.halls.length ? this.halls[0] : '';
//     this.selectedDate = this.dates.length ? this.dates[0] : '';

//     this.loadShowtimes();
//   }

//   loadShowtimes(): void {
//     if (this.selectedDate && this.selectedHall) {
//       this.showtimes = this.showtimeservice.getShowtimesByDateAndTheatre(
//         this.selectedDate,
//         this.selectedHall
//       );
//     } else {
//       this.showtimes = [];
//     }
//   }

//   getMovie(movieId: number): Movie | undefined {
//     return this.movies.find(m => m.id === movieId);
//   }

//   selectTime(showtimeId: number, time: string): void {
//     this.selectedTimes[showtimeId] = time;
//   }
// }
import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../Services/movie.service';
import { ShowtimeService } from '../../Services/showtime.service';
import { CommonModule } from '@angular/common';
import { Showtime } from '../../Interfaces/showtime.model';
import { Movie } from '../../Interfaces/movie.model';
import { FormsModule } from '@angular/forms';

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
  selectedHall: number | null = null;

  dates: string[] = [];
  selectedDate: string = '';

  
  selectedTimes: { [movieId: number]: string } = {};

  showtimes: GroupedShowtime[] = [];
  movies: Movie[] = [];

  constructor(
    private movieservice: MovieService,
    private showtimeservice: ShowtimeService
  ) {}

  ngOnInit(): void {
    this.movies = this.movieservice.getMovies();
    this.halls = this.showtimeservice.getTheatres(); 
    this.dates = this.showtimeservice.getDates();

    this.selectedHall = this.halls.length ? this.halls[0] : null;
    this.selectedDate = this.dates.length ? this.dates[0] : '';

    this.loadShowtimes();
  }

  loadShowtimes(): void {
    if (this.selectedDate && this.selectedHall) {
      const rawShowtimes = this.showtimeservice.getShowtimesByDateAndTheatre(
        this.selectedDate,
        this.selectedHall
      );

      // Grouping by movieId
      const grouped: { [movieId: number]: string[] } = {};
      rawShowtimes.forEach(s => {
        if (!grouped[s.movieId]) {
          grouped[s.movieId] = [];
        }
        grouped[s.movieId].push(s.time);
      });

      this.showtimes = Object.keys(grouped).map(movieId => ({
        movieId: Number(movieId),
        times: grouped[Number(movieId)]
      }));
    } else {
      this.showtimes = [];
    }
  }

  getMovie(movieId: number): Movie | undefined {
    return this.movies.find(m => m.id === movieId);
  }

  selectTime(movieId: number, time: string): void {
    this.selectedTimes[movieId] = time;
  }
}
