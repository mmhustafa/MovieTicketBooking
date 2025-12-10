  import { Injectable } from '@angular/core';
  import { Movie } from '../Interfaces/movie.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

  @Injectable({
    providedIn: 'root'
  })
  export class MovieService {
  private apiUrl = 'http://localhost:5158/api/movies';

  constructor(private http: HttpClient) { }

  getallMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}`);
  }
  getMovies(
    status: string = 'All',
    search: string = '',
    page: number = 1,
    pageSize: number = 8
  ): Observable<any> {

    let params = new HttpParams()
      .set('status', status)
      .set('search', search)
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http.get<any>(`${this.apiUrl}`, { params });
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`);
  }

  getNowShowing(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/now-showing`);
  }

  getComingSoon(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/coming-soon`);
  }
  }
