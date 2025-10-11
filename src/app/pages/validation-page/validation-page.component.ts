import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService, Order } from '../../services/supabase.service';
import { NavController, IonContent, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-validation-page',
  imports: [CommonModule, IonContent, IonButton],
  templateUrl: './validation-page.component.html',
  styleUrl: './validation-page.component.css'
})
export class ValidationPageComponent implements OnInit, OnDestroy {
  order: Order | null = null;
  orderItems: any[] = [];
  loading = true;
  countdown = 10;
  private countdownInterval: any;

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService,
    private navCtrl: NavController
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');

    if (orderId) {
      this.supabaseService.getOrderById(orderId).subscribe({
        next: (response) => {
          if (response.data) {
            this.order = response.data;
            this.orderItems = response.data.order_items || [];
          }
          this.loading = false;
          this.startCountdown();
        },
        error: (error) => {
          console.error('Erreur lors du chargement de la commande:', error);
          this.loading = false;
        }
      });
    }
  }

  startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.goHome();
      }
    }, 1000);
  }

  goHome(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    this.navCtrl.navigateRoot('/home');
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}
