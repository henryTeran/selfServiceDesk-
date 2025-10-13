import { Component } from '@angular/core';
import { NotificationService } from '../../services/notifications/notification.service';

@Component({
  selector: 'app-notification',
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  constructor(public notificationService: NotificationService) {} 

}
