import { Component, OnInit } from '@angular/core';
import { Movie } from '../../Interfaces/movie.model';
import { MovieService } from '../../Services/movie.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css'
})
export class MoviesComponent implements OnInit {
  movies : Movie[] =[];
  filteredMovies :Movie[] =[];
  currentPage = 1;
  pageSize =8;
  totalPages=1;
  searchTerm='';
  constructor(private movieservice : MovieService){

  }
  ngOnInit(): void {
    this.movies = this.movieservice.getMovies()
    this.applyFilters();
  }
  statusFilter: 'All' | 'NowShowing' | 'ComingSoon' = 'All';

  applyFilters() {
    this.filteredMovies = this.movies.filter(m => {
      const matchesSearch = m.title.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus =
        this.statusFilter === 'All' ||
        (this.statusFilter === 'NowShowing' && m.status === 'NowShowing') ||
        (this.statusFilter === 'ComingSoon' && m.status !== 'NowShowing');

      return matchesSearch && matchesStatus;
    });

    this.totalPages = Math.ceil(this.filteredMovies.length / this.pageSize);

    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages || 1;
  }


  get pagedMovies(): Movie[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredMovies.slice(start, start + this.pageSize);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  trackByMovieId(index: number, movie: Movie) {
  return movie.id;
}

}
