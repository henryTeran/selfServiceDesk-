// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { OrderPage } from './pages/order-page/order-page';
import { ChoiseOrderPageComponent } from './pages/choise-order-page/choise-order-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { AdminOrdersPageComponent } from './pages/admin-orders-page/admin-orders-page.component';
import { ChoisePaymentPageComponent } from './pages/choise-payment-page/choise-payment-page.component';
import { ValidationPageComponent } from './pages/validation-page/validation-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: 'choiseOrder',
    component: ChoiseOrderPageComponent,
  },
  {
    path: 'Menus',
    component: DashboardPageComponent,
  },
  {
    path: 'order/:uuid',
    component: OrderPage,
  },
  {
    path: 'admin/orders',
    component: AdminOrdersPageComponent,
  },
  {
    path: 'payment/select',
    component: ChoisePaymentPageComponent,
  },
  {
    path: 'payment/receipt',
    component: ValidationPageComponent,
  },
  {
    path: '**',
    redirectTo: 'home',
  }
];
