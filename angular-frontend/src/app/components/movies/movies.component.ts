import { Component, OnInit } from '@angular/core';
import { Movie } from '../../Interfaces/movie.model';
import { MovieService } from '../../Services/movie.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
  movies: Movie[] = [];
  currentPage = 1;
  pageSize = 8;
  totalPages = 1;
  totalMovies = 0;
  searchTerm = '';
  statusFilter: 'All' | 'NowShowing' | 'ComingSoon' = 'All';

  constructor(private movieservice: MovieService) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(page: number = 1) {
    this.movieservice.getMovies(this.statusFilter, this.searchTerm, page, this.pageSize)
      .subscribe(response => {
        this.movies = response.data;
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.totalMovies = response.totalMovies;
      });
  }

  onFilterChange() {
    this.loadMovies(1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.loadMovies(page);
    }
  }

  trackByMovieId(index: number, movie: Movie) {
    return movie.id;
  }
   get pagedMovies(): Movie[] {
    return this.movies; 
  }
}
