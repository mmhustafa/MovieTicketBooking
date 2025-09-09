import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TicketsComponent } from './components/tickets/tickets.component';
import { MoviesComponent } from './components/movies/movies.component';
import { ShowtimesComponent } from './components/showtimes/showtimes.component';
import { MoviedetailsComponent } from './components/moviedetails/moviedetails.component';
import { SeatsComponent } from './components/seats/seats.component';

export const routes: Routes = [
    {path: '',component: HomeComponent},
    {path: 'tickets',component: TicketsComponent},
    {path: 'movies',component: MoviesComponent},
    {path: 'movies/:id',component: MoviedetailsComponent },
    {path: 'showtimes',component: ShowtimesComponent},
    {path: 'seats/:showtimeId',component: SeatsComponent}
];
