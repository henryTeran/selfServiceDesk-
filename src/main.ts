import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { OrderPage } from './app/pages/order-page/order-page';
import { HomePageComponent } from './app/pages/home-page/home-page.component';

// bootstrapApplication(OrderPage, appConfig)
//   .catch((err) => console.error(err));

  
bootstrapApplication(HomePageComponent, appConfig)
.catch((err) => console.error(err));