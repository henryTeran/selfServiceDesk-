import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { OrderPage } from './app/pages/order-page/order-page';

bootstrapApplication(OrderPage, appConfig)
  .catch((err) => console.error(err));
