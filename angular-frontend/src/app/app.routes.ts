import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TicketsComponent } from './components/tickets/tickets.component';
import { MoviesComponent } from './components/movies/movies.component';
import { ShowtimesComponent } from './components/showtimes/showtimes.component';
import { MoviedetailsComponent } from './components/moviedetails/moviedetails.component';
import { SeatsComponent } from './components/seats/seats.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { AuthGuard } from './Guards/auth.guard';

export const routes: Routes = [
    {path: '',component: HomeComponent},
    {path: 'auth',component: AuthenticationComponent},
    {path: 'tickets',component: TicketsComponent},
    {path: 'movies',component: MoviesComponent},
    {path: 'movies/:id',component: MoviedetailsComponent },
    {path: 'showtimes',component: ShowtimesComponent},
    {path: 'seats/:showtimeId',component: SeatsComponent},
    {path: 'reservation',component: ReservationComponent, canActivate: [AuthGuard]}
];
