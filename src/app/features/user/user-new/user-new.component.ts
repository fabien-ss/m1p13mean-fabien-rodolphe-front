import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { SelectComponent } from '../../../shared/components/form/select/select.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { User } from '../../../services/models/user.model';
import { UserService } from '../../../services/services/user.service';


@Component({
  selector: 'app-user-new',
  standalone: true,
  imports: [FormsModule, LabelComponent, InputFieldComponent, SelectComponent, ButtonComponent],
  templateUrl: './user-new.component.html',
})
export class UserNewComponent {

  @Output() userCreated = new EventEmitter<User>();

  firstName = '';
  name = '';
  email = '';
  password = '';
  role = '';

  isLoading = false;
  errorMessage = '';

  roleOptions = [
    { label: 'Admin', value: 'admin' },
    { label: 'Manager', value: 'boutique' },
    { label: 'Client', value: 'client' },
  ];

  constructor(private userService: UserService) {}

  onClear() {
    this.firstName = '';
    this.name = '';
    this.email = '';
    this.password = '';
    this.role = '';
    this.errorMessage = '';
  }

  private isValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.firstName.trim()) { this.errorMessage = 'First name is required.'; return false; }
    if (!this.name.trim()) { this.errorMessage = 'Last name is required.'; return false; }
    if (!this.email.trim()) { this.errorMessage = 'Email is required.'; return false; }
    if (!emailRegex.test(this.email)) { this.errorMessage = 'Invalid email format.'; return false; }
    if (!this.password.trim()) { this.errorMessage = 'Password is required.'; return false; }
    if (this.password.length < 6) { this.errorMessage = 'Password must be at least 6 characters.'; return false; }
    if (!this.role) { this.errorMessage = 'Role is required.'; return false; }
    return true;
  }

  onSave() {
    this.errorMessage = '';
    if (!this.isValid()) return;
    this.isLoading = true;

    this.userService.create({
      firstName: this.firstName,
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.userCreated.emit(res.user);
        this.onClear();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.error ?? 'Failed to create user.';
      }
    });
  }
}