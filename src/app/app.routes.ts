// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { OrderPage } from './pages/order-page/order-page';
import { ChoiseOrderPageComponent } from './pages/choise-order-page/choise-order-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';

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
    path: '**',
    redirectTo: 'home',
  }
];
