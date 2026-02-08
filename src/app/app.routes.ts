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
import { ProductInvetoryComponent } from './features/products/pages/product-invetory/product-invetory.component';
import { ProductSettingsComponent } from './features/products/pages/product-settings/product-settings.component';
import { ProductOrdersComponent } from './features/products/pages/product-orders/product-orders.component';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';
import { authGuard } from './services/guards/auth.guard';

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
    canActivate: [authGuard]
  },
  {
    path: 'shop',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        component: ShopManagementComponent,
        pathMatch: 'full',
        title: 'Managing shop',
        canActivate: [authGuard]
      },
      {
        path: 'view',
        component: ShopViewComponent,
        pathMatch: 'full',
        title: 'Managing shop'
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
        path: 'view/products/inventory',
        component: ProductInvetoryComponent,
        title:
          'Product inventory',
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
    ],
    canActivate: [authGuard]
  },
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
];
