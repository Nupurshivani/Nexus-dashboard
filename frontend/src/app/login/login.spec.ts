// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { Login } from './login';

// describe('Login', () => {
//   let component: Login;
//   let fixture: ComponentFixture<Login>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [Login]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(Login);
//     component = fixture.componentInstance;
//     await fixture.whenStable();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });


import { Component } from '@angular/core';
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
  errorMessage = ''; // 🔴 NEW

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(): void {
    this.errorMessage = ''; // clear old error

    this.http.post<any>('http://localhost:5000/api/auth/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // 🔴 HANDLE WRONG CREDENTIALS
        this.errorMessage = err.error?.msg || 'Login failed. Please try again.';
      }
    });
  }
}
