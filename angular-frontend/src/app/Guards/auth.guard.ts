import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    // Check if user is already authenticated or guest
    if (this.authService.isAuthenticated()) {
      return of(true);
    }

    // Navigate to login/guest choice
    this.router.navigate(['/auth']);
    return of(false);
  }
}
