import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IdleService } from './services/idle.service';
import { NotificationService } from './services/notifications/notification.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(
    private idleService: IdleService,
  ){}
}
