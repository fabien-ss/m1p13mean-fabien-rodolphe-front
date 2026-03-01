import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { SelectComponent } from '../../../shared/components/form/select/select.component';
import { SwitchComponent } from '../../../shared/components/form/input/switch.component';
import { User } from '../../../services/models/user.model';
import { UserService } from '../../../services/services/user.service';


@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [FormsModule, LabelComponent, InputFieldComponent, SelectComponent, SwitchComponent, ButtonComponent],
  templateUrl: './user-edit.component.html',
})
export class UserEditComponent implements OnChanges {

  @Input() user!: User;
  @Output() userUpdated = new EventEmitter<User>();

  firstName = '';
  name = '';
  email = '';
  role = '';
  isActive = true;

  isLoading = false;
  errorMessage = '';

  roleOptions = [
    { label: 'Admin', value: 'admin' },
    { label: 'Manager', value: 'boutique' },
    { label: 'Client', value: 'client' },
  ];

  constructor(private userService: UserService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.populateFields();
    }
  }

  private populateFields(): void {
    this.firstName  = this.user.firstName ?? '';
    this.name       = this.user.name ?? '';
    this.email      = this.user.email ?? '';
    this.role       = this.user.role?.name ?? '';
    this.isActive   = this.user.isActive ?? true;
    this.errorMessage = '';
  }

  onReset() { this.populateFields(); }

  private isValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.firstName.trim()) { this.errorMessage = 'First name is required.'; return false; }
    if (!this.name.trim()) { this.errorMessage = 'Last name is required.'; return false; }
    if (!this.email.trim()) { this.errorMessage = 'Email is required.'; return false; }
    if (!emailRegex.test(this.email)) { this.errorMessage = 'Invalid email format.'; return false; }
    if (!this.role) { this.errorMessage = 'Role is required.'; return false; }
    return true;
  }

  onSave() {
    this.errorMessage = '';
    if (!this.isValid()) return;
    this.isLoading = true;

    this.userService.update(this.user._id, {
      firstName: this.firstName,
      name: this.name,
      email: this.email,
      role: this.role,
      isActive: this.isActive,
    }).subscribe({
      next: (updated) => {
        this.isLoading = false;
        this.userUpdated.emit(updated);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.error ?? 'Failed to update user.';
      }
    });
  }
}