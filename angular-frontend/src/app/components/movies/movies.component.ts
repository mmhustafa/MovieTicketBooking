import { Component, OnInit } from '@angular/core';
import { Movie } from '../../Interfaces/movie.model';
import { MovieService } from '../../Services/movie.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule,FormsModule],
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
  applyFilters() {
    
    this.filteredMovies = this.movies.filter(m =>
      m.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    
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
}
