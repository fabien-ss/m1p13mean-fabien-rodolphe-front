import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { User } from '../../../services/models/user.model';
import { UserService } from '../../../services/services/user.service';


@Component({
  selector: 'app-user-reset-password',
  standalone: true,
  imports: [FormsModule, LabelComponent, InputFieldComponent, ButtonComponent],
  templateUrl: './user-reset-password.component.html',
})
export class UserResetPasswordComponent {

  @Input() user!: User;
  @Output() close = new EventEmitter<void>();

  password = '';
  confirmPassword = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private userService: UserService) {}

  onSave() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.password.trim()) { this.errorMessage = 'Password is required.'; return; }
    if (this.password.length < 6) { this.errorMessage = 'Password must be at least 6 characters.'; return; }
    if (this.password !== this.confirmPassword) { this.errorMessage = 'Passwords do not match.'; return; }

    this.isLoading = true;
    this.userService.resetPassword(this.user._id, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Password reset successfully.';
        this.password = '';
        this.confirmPassword = '';
        setTimeout(() => this.close.emit(), 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.error ?? 'Failed to reset password.';
      }
    });
  }
}