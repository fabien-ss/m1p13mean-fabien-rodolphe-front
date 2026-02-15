import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);
  email = '';
  password = '';
  firstName = '';
  lastName = '';

  register() {
    const user = {
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      name: this.lastName
    };
    this.authService.register(user).subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }
}
