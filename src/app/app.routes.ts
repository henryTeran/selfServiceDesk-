import { Routes } from '@angular/router';
import { OrderPage } from './pages/order-page/order-page';
import { HomePageComponent } from './pages/home-page/home-page.component';

export const routes: Routes = [
    {
        path: 'home',
        component: HomePageComponent,
    },
    {
        path: 'order',
        component: OrderPage,
    },
    {
        path: 'order',
        component: OrderPage,
    },
    {
        path: '',
        component: OrderPage,
    },
    {
        path: '**',
        component: OrderPage,
    },

];
