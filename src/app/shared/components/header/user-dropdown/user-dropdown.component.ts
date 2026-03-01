import { Component } from '@angular/core';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  imports:[CommonModule,RouterModule,DropdownComponent]
})
export class UserDropdownComponent {
  singout() {
    const keepLoggedIn = localStorage.getItem('keepLoggedIn');
    if (keepLoggedIn === 'true') { 
      window.location.href = '/#/login';
      return;
    }
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userFirstName');
    window.location.href = '/#/login';
  }
  isOpen = false;

  currentUserName = localStorage.getItem('userName') || 'User';
  currentUserFirstName = localStorage.getItem('userFirstName') || 'User';
  currentUserMail = localStorage.getItem('email') || '';

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }
}