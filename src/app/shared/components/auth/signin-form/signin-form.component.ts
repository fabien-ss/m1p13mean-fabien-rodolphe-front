import { Component } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-signin-form',
  standalone: true,
  imports: [
    CommonModule,
    LabelComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './signin-form.component.html',
})
export class SigninFormComponent {

  showPassword = false;
  isChecked = false;
  isLoading = false;
  errorMessage = '';

  email = 'test@test.test';
  password = 'mypassword123';

  private apiEndPoint = environment.apiUrl;

  private apiUrl = `${this.apiEndPoint}/auth/login`;

  constructor(private http: HttpClient, private router: Router) { }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignIn() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.http.post<{ token: string; user: any }>(this.apiUrl, {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('userFirstName', response.user.firstName);
        localStorage.setItem('userName', response.user.name);
        localStorage.setItem('currentUserRole', response.user.role);
        localStorage.setItem('keepLoggedIn', this.isChecked.toString());
        localStorage.setItem('email', response.user.email);
        if (response.user.role === 'admin') {
          this.router.navigate(['/dashboard']);
        } else if (response.user.role === 'boutique') {
          this.router.navigate(['/admin-shop']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message ?? 'Invalid email or password.';
      }
    });
  }

  ngOnInit() {
    localStorage.setItem("theme", "dark")
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem("currentUserRole")
    if (token && (userRole === 'admin' || userRole === 'boutiqe')) {
      this.router.navigate(['/dashboard']);
    }
  }
}