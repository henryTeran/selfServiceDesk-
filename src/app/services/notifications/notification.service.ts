import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }
  messages: string[] = [];

  addMessage(message: string) {
    this.messages.push(message);
    setTimeout(() => {
      this.messages.shift(); // Supprime après 3 secondes
    }, 3000);
  }
}
