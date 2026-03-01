import { Routes } from '@angular/router';
import { EcommerceComponent } from './pages/dashboard/ecommerce/ecommerce.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth-pages/sign-up/sign-up.component';
import { ProductCreateComponent } from './features/products/pages/product-create/product-create.component';
import { ShopManagementComponent } from './features/shop/pages/shop-management/shop-management.component';
import { ShopViewComponent } from './features/shop/pages/shop-view/shop-view.component';
import { ProductListComponent } from './features/products/pages/product-list/product-list.component';
import { ProductCategoriesComponent } from './features/products/pages/product-categories/product-categories.component';
import { ProductSettingsComponent } from './features/products/pages/product-settings/product-settings.component';
import { ProductOrdersComponent } from './features/products/pages/product-orders/product-orders.component';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';
import { ClientLayoutComponent } from './client/layout/client-layout.component';
import { authGuard } from './services/guards/auth.guard';
import { roleGuard } from './services/guards/role.guard';
import { ForbidenComponent } from './pages/other-page/forbiden/forbiden.component';

import { UserNewComponent } from './features/user/user-new/user-new.component';
import { UserEditComponent } from './features/user/user-edit/user-edit.component';
import { UserResetPasswordComponent } from './features/user/user-reset-password/user-reset-password.component';
import { UserListComponent } from './features/user/user-list/user-list.component';

export const routes: Routes = [
  {
    path: '',
    component: ClientLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./client/pages/home/home-page').then(m => m.HomePage)
      },

      { path: 'catalog', loadComponent: () => import('./client/pages/catalog/catalog.component').then(m => m.CatalogComponent) },
      { path: 'product/:id', loadComponent: () => import('./client/pages/product/product-detail.component').then(m => m.ProductDetailComponent) },
      { path: 'shop/:id', loadComponent: () => import('./client/pages/shop/shop-detail.component').then(m => m.ShopDetailComponent) },
      { path: 'shops', loadComponent: () => import('./client/pages/shop/shops.component').then(m => m.ShopsComponent) },
      { path: 'cart', loadComponent: () => import('./client/pages/cart/cart.component').then(m => m.CartComponent) },
      { path: 'deals', loadComponent: () => import('./client/pages/hot-deal/hot-deal.component').then(m => m.HotDealComponent) },
      { path: 'auth/login', loadComponent: () => import('./client/pages/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'auth/register', loadComponent: () => import('./client/pages/auth/register/register.component').then(m => m.RegisterComponent) },
      { path: 'account', loadComponent: () => import('./client/pages/account/account.component').then(m => m.AccountComponent) },
    ]
  },
  {
    path:'dashboard',
    component:AppLayoutComponent,
    children:[
      {
        path: '',
        component: EcommerceComponent,
        pathMatch: 'full',
        title:
          'Akoor',
      },
    ],
    canActivate: [authGuard, roleGuard(['admin'])]
  },
  {
    path: 'admin-shop',
    component: AppLayoutComponent,
    canActivate: [authGuard, roleGuard(['boutique', 'admin'])],
    children: [
      {
        path: 'view/promotions',
        loadComponent: () => import('./features/products/pages/shop-promotion/shop-promotions.component').then(m => m.ShopPromotionsComponent),
        title: 'm1p13mean-fabien-rodolphe - Shop Promotions',
        canActivate: [authGuard, roleGuard(['boutique', 'admin'])]
      },
      {
        path: '',
        component: ShopManagementComponent,
        pathMatch: 'full',
        title: 'm1p13mean-fabien-rodolphe - Managing shop',
        canActivate: [authGuard, roleGuard(['boutique', 'admin'])]
      },
      {
        path: 'view',
        component: ShopViewComponent,
        pathMatch: 'full',
        title: 'm1p13mean-fabien-rodolphe - Shop View',
        canActivate: [authGuard, roleGuard(['boutique', 'admin'])]
      },
      {
        path: 'view/products/add',
        component: ProductCreateComponent,
        title: 'Product new',
        canActivate: [authGuard, roleGuard(['boutique'])]
      },
      {
        path: 'view/products',
        component: ProductListComponent,
        pathMatch: 'full',
        title:
          'Product list',
        canActivate: [authGuard, roleGuard(['boutique'])]
      },
      {
        path: 'view/products/settings',
        component: ProductSettingsComponent,
        title:
          'Settings',
      },
      {
        path: 'view/products/orders',
        component: ProductOrdersComponent,
        title: 'Orders',
        canActivate: [authGuard, roleGuard(['boutique'])]
      },
    ]
  },
  {
    path: 'user',
    title: 'User',
    component: AppLayoutComponent,
    canActivate: [authGuard, roleGuard(['admin'])],
    children: [
      {
        path: 'list',
        component: UserListComponent,
        title: 'User List'
      },
      {
        path: 'new',
        component: UserNewComponent,
        title: 'New User'
      },
      {
        path: 'edit',
        component: UserEditComponent,
        title: 'Edit User'
      },
      {
        path: 'reset-password',
        component: UserResetPasswordComponent,
        title: 'Reset Password'
      }
    ]
  },
  {
    path: 'category',
    title: 'Category',
    component: AppLayoutComponent,
    canActivate: [authGuard, roleGuard(['admin'])],
    children: [
      {
        path: '',
        component: ProductCategoriesComponent,
        pathMatch: 'full',
        title: 'Category List'
      },
    ]
  }
  ,
  // auth pages
  {
    path: 'signup',
    component: SignUpComponent,
    title: 'Sign Up'
  },
  {
    path: 'login',
    component: SignInComponent,
    title: 'Sign Up'
  },
  // error pages
  {
    path: '**',
    component: NotFoundComponent,
    title: 'Page not found'
  },
  {
    path:'unauthorized',
    component: ForbidenComponent,
    title:'Forbidden'
  }
];
