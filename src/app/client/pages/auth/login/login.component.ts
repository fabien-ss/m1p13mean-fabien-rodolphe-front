import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  email = '';
  password = '';

  login() {
    this.authService.login({ email: this.email, password: this.password }).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
