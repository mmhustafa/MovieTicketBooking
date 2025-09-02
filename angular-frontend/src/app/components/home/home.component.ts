import { Component } from '@angular/core';
import { Movie } from '../../Interfaces/movie.model';
import { MovieService } from '../../Services/movie.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  nowShowing: Movie[] = [];
  comingSoon :Movie[]=[];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.nowShowing = this.movieService.getNowShowing();
    this.comingSoon = this.movieService.getComingSoon();
  }
}
