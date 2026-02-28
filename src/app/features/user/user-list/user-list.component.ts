import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { TableDropdownComponent } from '../../../shared/components/common/table-dropdown/table-dropdown.component';
import { UserNewComponent } from '../user-new/user-new.component';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { UserResetPasswordComponent } from '../user-reset-password/user-reset-password.component';
import { UserService } from '../../../services/services/user.service';
import { User } from '../../../services/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    FormsModule,
    ButtonComponent,
    ModalComponent, 
    TableDropdownComponent,
    UserNewComponent,
    UserEditComponent,
    UserResetPasswordComponent,
  ],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {

  constructor(private userService: UserService) {}

  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUser: User | null = null;

  searchQuery = '';

  isLoading = false;
  errorMessage = '';

  // Modals
  isCreateModalOpen = false;
  isEditModalOpen = false;
  isResetPasswordModalOpen = false;

  date = new Date();

  plusIcon = `<svg width="1em" height="1em" viewBox="0 0 20 20" fill="none"
      xmlns="http://www.w3.org/2000/svg" class="size-4">
    <path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`;

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Failed to load users.';
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    const q = this.searchQuery.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      u.firstName.toLowerCase().includes(q) ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.name.toLowerCase().includes(q)
    );
  }

  // --- Modals ---
  openCreateModal() { this.isCreateModalOpen = true; }
  closeCreateModal() { this.isCreateModalOpen = false; }

  openEditModal(user: User) {
    this.selectedUser = user;
    this.isEditModalOpen = true;
  }
  closeEditModal() {
    this.isEditModalOpen = false;
    this.selectedUser = null;
  }

  openResetPasswordModal(user: User) {
    this.selectedUser = user;
    this.isResetPasswordModalOpen = true;
  }
  closeResetPasswordModal() {
    this.isResetPasswordModalOpen = false;
    this.selectedUser = null;
  }

  // --- Callbacks ---
  onUserCreated(user: User) {
    this.users = [user, ...this.users];
    this.filteredUsers = [user, ...this.filteredUsers];
    this.closeCreateModal();
  }

  onUserUpdated(updatedUser: User) {
    this.users = this.users.map(u => u._id === updatedUser._id ? updatedUser : u);
    this.filteredUsers = this.filteredUsers.map(u => u._id === updatedUser._id ? updatedUser : u);
    this.closeEditModal();
  }

  // --- Actions ---
  toggleActive(user: User) {
    const action$ = user.isActive
      ? this.userService.deactivate(user._id)
      : this.userService.activate(user._id);

    action$.subscribe({
      next: (updated) => {
        this.users = this.users.map(u => u._id === updated._id ? updated : u);
        this.filteredUsers = this.filteredUsers.map(u => u._id === updated._id ? updated : u);
      },
      error: (err) => { this.errorMessage = err?.error?.message ?? 'Action failed.'; }
    });
  }
}