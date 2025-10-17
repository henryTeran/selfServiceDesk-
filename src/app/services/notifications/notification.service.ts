import { Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly _notifications = signal<Notification[]>([]);
  public readonly notifications = this._notifications.asReadonly();

  private readonly MAX_QUEUE_SIZE = 5;
  private readonly AUTO_DISMISS_DELAY = 3000;

  constructor(private snackBar: MatSnackBar) {}

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000): void {
    const notification: Notification = {
      id: this.generateId(),
      message,
      type,
      timestamp: Date.now()
    };

    this.addToQueue(notification);

    this.snackBar.open(message, '', {
      duration,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: [`custom-snackbar`, `snackbar-${type}`]
    });

    setTimeout(() => {
      this.removeFromQueue(notification.id);
    }, this.AUTO_DISMISS_DELAY);
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  private addToQueue(notification: Notification): void {
    const current = this._notifications();

    if (current.length >= this.MAX_QUEUE_SIZE) {
      current.shift();
    }

    this._notifications.set([...current, notification]);
  }

  private removeFromQueue(id: string): void {
    const current = this._notifications();
    this._notifications.set(current.filter(n => n.id !== id));
  }

  private generateId(): string {
    return `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  clearAll(): void {
    this._notifications.set([]);
  }
}
