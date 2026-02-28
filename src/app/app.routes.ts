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
import { authGuard } from './services/guards/auth.guard';
import { roleGuard } from './services/guards/role.guard';
import { ForbidenComponent } from './pages/other-page/forbiden/forbiden.component';

import { UserNewComponent } from './features/user/user-new/user-new.component';
import { UserEditComponent } from './features/user/user-edit/user-edit.component';
import { UserResetPasswordComponent } from './features/user/user-reset-password/user-reset-password.component';
import { UserListComponent } from './features/user/user-list/user-list.component';

export const routes: Routes = [
  {
    path:'dashboard',
    component:AppLayoutComponent,
    children:[
      {
        path: '',
        component: EcommerceComponent,
        pathMatch: 'full',
        title:
          'Angular Ecommerce Dashboard | TailAdmin - Angular Admin Dashboard Template',
      },
    ],
    canActivate: [authGuard, roleGuard(['admin'])]
  },
  {
    path: 'shop',
    component: AppLayoutComponent,
    canActivate: [authGuard, roleGuard(['boutique', 'admin'])],
    children: [
      {
        path: '',
        component: ShopManagementComponent,
        pathMatch: 'full',
        title: 'Managing shop',
      },
      {
        path: 'view',
        component: ShopViewComponent,
        pathMatch: 'full',
        title: 'Managing shop',
      },
      {
        path: 'view/products/add',
        component: ProductCreateComponent,
        title: 'Product new',
      },
      {
        path: 'view/products',
        component: ProductListComponent,
        pathMatch: 'full',
        title:
          'Product list',
      },
      {
        path: 'view/products/categories',
        component: ProductCategoriesComponent,
        title:
          'Product categories',
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
        title:
          'Orders',
      },
      
    ]
  },
  {
    path: 'user',
    title: 'User',
    component: AppLayoutComponent,
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
  }
  ,
  // auth pages
  {
    path:'',
    component:SignInComponent,
    title:'Sign In'
  },
  {
    path:'signup',
    component:SignUpComponent,
    title:'Sign Up'
  },
  {
    path:'login',
    component:SignInComponent,
    title:'Sign Up'
  },
  // error pages
  {
    path:'**',
    component: NotFoundComponent,
    title:'Page not found'
  },
  {
    path:'unauthorized',
    component: ForbidenComponent,
    title:'Forbidden'
  }
];
