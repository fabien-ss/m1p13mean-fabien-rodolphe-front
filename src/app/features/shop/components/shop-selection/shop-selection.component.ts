import { Component } from '@angular/core';
import { TableDropdownComponent } from '../../../../shared/components/common/table-dropdown/table-dropdown.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

export interface Shop {
  _id: string;
  name: string;
  description?: string;
  email: string;
  phone?: string;
  mall: string;
  manager: {
    _id: string;
    firstName: string;
    name: string;
    image?: string;
    role?: string;
  };
  product?: string[];
  creationDate: string;
  type?: string;
  images: string[]
}
@Component({
  selector: 'app-shop-selection',
  standalone: true,
  imports: [
    TableDropdownComponent,
    ButtonComponent
  ],
  templateUrl: './shop-selection.component.html',
  styleUrl: './shop-selection.component.css',
})
export class ShopSelectionComponent {

  constructor(private router: Router, private http: HttpClient) {}

  isLoading = false;
  errorMessage = "";

  private apiEndPoint = environment.apiUrl;

  private apiUrl = `${this.apiEndPoint}/shop`;


  boxIcon = `
    <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" 
        xmlns="http://www.w3.org/2000/svg" class="size-5">
      <path d="M7 5L12 10L7 15" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"/>
    </svg>
`;
  
  shops: Shop[] = [];

  handleViewMore() {
    console.log('View More clicked');
    // Add your view more logic here
  }

  handleDelete() {
    console.log('Delete clicked');
    // Add your delete logic here
  }

  goToView(shop: Shop) {
    localStorage.setItem('selectedShop', shop.name);
    this.router.navigate(['/shop/view']);
  }

  fetchShops(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<Shop[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.shops = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Failed to load shops.';
        this.isLoading = false;
      }
    });
  }

  ngOnInit(): void {
    this.fetchShops();
  }
}
