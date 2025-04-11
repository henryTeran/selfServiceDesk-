import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IdleService } from './services/idle.service';
import { NotificationService } from './services/notifications/notification.service';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  imports: [RouterModule, IonApp, IonRouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(
    // private idleService: IdleService,
  ){}
}
