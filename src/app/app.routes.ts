// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { OrderPage } from './pages/order-page/order-page';

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
    path: 'order',
    component: OrderPage,
  },
  {
    path: '**',
    redirectTo: 'home',
  }
];
