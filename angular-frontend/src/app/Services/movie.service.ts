import { Injectable } from '@angular/core';
import { Movie } from '../Interfaces/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private movies: Movie[] = [
    {
      id: 1,
      title: 'The Amazing Spider-Man',
      genre: 'Action',
      duration: '2h 15m',
      year: 2023,
      posterUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e0/The_Amazing_Spider-Man_%28film%29_poster.jpg',
      status:'NowShowing',
    "overview" : "lorem ahkjhgkjl"

    },
    {
      id: 2,
      title: 'Avengers: Endgame',
      genre: 'Action/Adventure',
      duration: '3h 1m',
      year: 2019,
      posterUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e0/The_Amazing_Spider-Man_%28film%29_poster.jpg',
      status:'NowShowing',
    "overview" : "lorem ahkjhgkjl"

    },
    {
      id: 3,
      title: 'Inception',
      genre: 'Sci-Fi/Thriller',
      duration: '2h 28m',
      year: 2010,
      posterUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e0/The_Amazing_Spider-Man_%28film%29_poster.jpg',
      status:'NowShowing',
    "overview" : "lorem ahkjhgkjl"


    },
    {
      id: 4,
      title: 'Interstellar',
      genre: 'Sci-Fi/Drama',
      duration: '2h 49m',
      year: 2014,
      posterUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e0/The_Amazing_Spider-Man_%28film%29_poster.jpg',
      status:'NowShowing',
    "overview" : "lorem ahkjhgkjl"

    },
    {
    "id": 8,
    "title": "Interstellar",
    "genre": "Sci-Fi/Drama",
    "duration": "2h 49m",
    "year": 2014,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
    "status": "ComingSoon",
    "overview" : "lorem ahkjhgkjl"

  },
  {
    "id": 5,
    "title": "Inception",
    "genre": "Sci-Fi/Thriller",
    "duration": "2h 28m",
    "year": 2010,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
    "status": "ComingSoon",
    "overview" : "lorem ahkjhgkjl"
  },
  {
    "id": 6,
    "title": "Dune: Part Two",
    "genre": "Sci-Fi/Adventure",
    "duration": "2h 46m",
    "year": 2024,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
    "status": "ComingSoon",
    "overview" : "lorem ahkjhgkjl"
  },
  {
    "id": 7,
    "title": "The Batman 2",
    "genre": "Action/Crime",
    "duration": "2h 55m",
    "year": 2025,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
    "status": "ComingSoon",
    "overview" : "lorem ahkjhgkjl"
  }
]


  constructor() { }
  getMovies(): Movie[] {
    return this.movies;
  }
  getMovieById(id: number): Movie | undefined {
  return this.movies.find(m => m.id === id);
  }

  getNowShowing(): Movie[] {
    return this.movies.filter(movie => movie.status === 'NowShowing');
  }

  
  getComingSoon(): Movie[] {
    return this.movies.filter(movie => movie.status === 'ComingSoon');
  }
}
