import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css'
})
export class AuthenticationComponent {
  showLoginForm = false;
  showRegisterForm = false;
  
  loginUsername = '';
  loginPassword = '';
  
  registerUsername = '';
  registerEmail = '';
  registerPassword = '';
  registerConfirmPassword = '';
  
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  showLogin(): void {
    this.showLoginForm = true;
    this.showRegisterForm = false;
    this.clearMessages();
  }

  showRegister(): void {
    this.showRegisterForm = true;
    this.showLoginForm = false;
    this.clearMessages();
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  loginUser(): void {
    if (!this.loginUsername || !this.loginPassword) {
      this.errorMessage = 'Please enter username and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginUsername, this.loginPassword).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          this.successMessage = 'Login successful! Redirecting...';
          setTimeout(() => {
            this.router.navigate(['/tickets']);
          }, 1000);
        }
      },
      error: (err) => {
        this.isLoading = false;
        const errorMsg = err?.error?.message || err?.statusText || 'Login failed. Please check your credentials.';
        this.errorMessage = errorMsg;
        console.error('Login error:', err);
      }
    });
  }

  registerUser(): void {
    if (!this.registerUsername || !this.registerEmail || !this.registerPassword) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.registerPassword !== this.registerConfirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.registerPassword.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.registerUsername, this.registerEmail, this.registerPassword)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Registration successful! You can now login.';
          // Auto switch to login form
          setTimeout(() => {
            this.showLogin();
            this.loginUsername = this.registerUsername;
          }, 1500);
        },
        error: (err) => {
          this.isLoading = false;
          const errorMsg = err?.error?.['']?.[0] || err?.error?.message || 'Registration failed. Please try again.';
          this.errorMessage = errorMsg;
          console.error('Registration error:', err);
        }
      });
  }

  goBackToChoice(): void {
    this.showLoginForm = false;
    this.showRegisterForm = false;
    this.clearMessages();
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
