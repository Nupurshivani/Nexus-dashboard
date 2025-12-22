import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  email = '';
  password = '';
  errorMessage = '';
  isSubmitting = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef   // 🔴 IMPORTANT
  ) {}

  login(): void {
    if (this.isSubmitting) return;

    this.errorMessage = '';
    this.isSubmitting = true;
    this.cdr.detectChanges(); // 🔴 force UI

    this.http.post<any>('http://localhost:5000/api/auth/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        localStorage.setItem('token', res.token);
        this.cdr.detectChanges(); // 🔴 force UI
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isSubmitting = false;

        // 🔴 GUARANTEED ERROR MESSAGE
        if (err.status === 400 || err.status === 401) {
          this.errorMessage = err.error?.msg || 'Invalid email or password';
        } else {
          this.errorMessage = 'Server error. Try again.';
        }

        this.cdr.detectChanges(); // 🔴 THIS FIXES YOUR ISSUE
      }
    });
  }

  clearError(): void {
    this.errorMessage = '';
    this.cdr.detectChanges();
  }
}
