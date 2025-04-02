import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from './notifications/notification.service';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private idleTimeout: any;
  private redirectTimeout: any;
  private readonly TIMEOUT_DURATION = 40000; // inactivité = 1 min
  private readonly COUNTDOWN_DURATION = 10000; // délai avant retour (10 sec)

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private _notificationService: NotificationService
  ) { 
    this.initListener();
    this.resetTimer();
  }

  private initListener() {
    const events = ['mousemove', 'keydown', 'touchstart', 'click'];
    events.forEach(event =>
      window.addEventListener(event, () => this.resetTimer())
    );
  }

  private resetTimer() {
    clearTimeout(this.idleTimeout);
    clearTimeout(this.redirectTimeout);

    this.ngZone.runOutsideAngular(() => {
      this.idleTimeout = setTimeout(() => {
        this.ngZone.run(() => {
          if (this.router.url !== '/home') {
            this._notificationService.show('Retour à l’accueil dans 10 secondes...');
            
            this.redirectTimeout = setTimeout(() => {
              this.router.navigate(['/home']);
            }, this.COUNTDOWN_DURATION);
          }
        });
      }, this.TIMEOUT_DURATION);
    });
  }
}
