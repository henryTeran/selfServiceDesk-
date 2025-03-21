import { Routes } from '@angular/router';
import { OrderPage } from './pages/order-page/order-page';

export const routes: Routes = [
    {
        path: 'order',
        component: OrderPage,
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
