import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get JWT token from localStorage
    const token = this.authService.getToken();

    // Clone the request and add Authorization header if token exists
    if (token) {
      console.log(' Adding token to request:', request.url);
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(' Authorization header added');
    } else {
      console.log(' No token found for request:', request.url);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', error.status, error.statusText, error.message);
        
        // If 401 Unauthorized, redirect to login
        if (error.status === 401) {
          console.log(' Received 401 - Token may be expired or invalid');
          this.authService.logout();
          this.router.navigate(['/auth']);
        } else if (error.status === 0) {
          console.error('Network error - Backend may not be running');
        }
        
        return throwError(() => error);
      })
    );
  }
}
