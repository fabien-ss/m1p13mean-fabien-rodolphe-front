import { Routes } from '@angular/router';
import { EcommerceComponent } from './pages/dashboard/ecommerce/ecommerce.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth-pages/sign-up/sign-up.component';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ClientLayoutComponent } from './client/layout/client-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: ClientLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./client/pages/home/home-page').then(m => m.HomePage)
      },
      
      { path: 'catalog', loadComponent: () => import('./client/pages/home/home-page').then(m => m.HomePage) },
      { path: 'product/:id', loadComponent: () => import('./client/pages/product/product-detail.component').then(m => m.ProductDetailComponent) },
      { path: 'shop/:id', loadComponent: () => import('./client/pages/shop/shop-detail.component').then(m => m.ShopDetailComponent) },
      { path: 'cart', loadComponent: () => import('./client/pages/cart/cart.component').then(m => m.CartComponent) },
      { path: 'auth/login', loadComponent: () => import('./client/pages/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'auth/register', loadComponent: () => import('./client/pages/auth/register/register.component').then(m => m.RegisterComponent) },
    ]
  },
];
