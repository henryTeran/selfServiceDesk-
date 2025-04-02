import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }
  messages: string[] = [];

  addMessage(message: string) {
    this.messages.push(message);
    setTimeout(() => {
      this.messages.shift(); // Supprime après 3 secondes
    }, 3000);
  }

  show(message: string, duration: number = 3000) {
    this.snackBar.open(message, '', {
      duration,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: ['custom-snackbar']
    });
  }
}
