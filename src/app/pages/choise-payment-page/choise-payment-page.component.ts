import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CartStore } from '../../services/cart-store.service';
import { SupabaseApiService } from '../../services/supabase-api.service';
import { NotificationService } from '../../services/notifications/notification.service';
import { ChoiseService } from '../../services/choise.service';
import { firstValueFrom } from 'rxjs';
import { SimplifiedRecipe, CartItem } from '../../interfaces';
import { PricePipe } from '../../pipes/price.pipe';

type PaymentMethod = 'card' | 'cash' | null;

@Component({
  selector: 'app-choise-payment-page',
  imports: [CommonModule, PricePipe],
  templateUrl: './choise-payment-page.component.html',
  styleUrl: './choise-payment-page.component.css'
})
export class ChoisePaymentPageComponent implements OnInit {
  selectedMethod: PaymentMethod = null;
  cartItems: CartItem[] = [];
  totalPrice = 0;
  isProcessing = false;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly cartStore: CartStore,
    private readonly supabaseService: SupabaseApiService,
    private readonly notificationService: NotificationService,
    private readonly choiseService: ChoiseService
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartStore.items();
    this.totalPrice = this.cartStore.total();

    if (this.cartItems.length === 0) {
      this.notificationService.warning('Le panier est vide !');
      this.router.navigate(['/home']);
    }
  }

  selectPaymentMethod(method: PaymentMethod): void {
    this.selectedMethod = method;
  }

  async confirmPayment(): Promise<void> {
    if (!this.selectedMethod) {
      this.notificationService.warning('Veuillez sélectionner un mode de paiement');
      return;
    }

    this.isProcessing = true;

    try {
      const orderDataFormat: SimplifiedRecipe[] = this.cartItems.flatMap(item =>
        Array(item.quantity).fill({
          uuid: item.recipe.uuid,
          title: item.recipe.title,
          description: item.recipe.description,
          price: item.recipe.price,
          imageUrl: item.recipe.imageUrl
        })
      );

      const orderType = await firstValueFrom(this.choiseService.choise$) || 'emporter';
      const paymentMethodLabel = this.selectedMethod === 'card' ? 'Carte bancaire' : 'Caisse';

      const result = await this.supabaseService.saveOrder(
        orderDataFormat,
        orderType,
        paymentMethodLabel
      );

      if (result) {
        this.notificationService.success(`Commande ${result.order_number} enregistrée !`);
        this.cartStore.clear();

        this.router.navigate(['/payment/receipt'], {
          queryParams: {
            orderId: result.id,
            orderNumber: result.order_number
          }
        });
      }
    } catch (error) {
      console.error('Erreur lors du paiement :', error);
      this.notificationService.error('Erreur lors du traitement du paiement');
    } finally {
      this.isProcessing = false;
    }
  }

  cancel(): void {
    this.router.navigate(['/order', this.route.snapshot.params['uuid'] || '']);
  }
}
