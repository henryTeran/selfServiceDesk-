import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../interfaces';
import { NotificationService } from '../../services/notifications/notification.service';
import { CartStore } from '../../services/cart-store.service';
import { PricePipe } from '../../pipes/price.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, PricePipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  @Output() saveOrder = new EventEmitter<CartItem[]>();

  constructor(
    private readonly _notificationService: NotificationService,
    public readonly cartStore: CartStore
  ) {}

  incrementQuantity(item: CartItem): void {
    this.cartStore.incrementQuantity(item.recipe.uuid);
    this._notificationService.info(`Quantité augmentée pour ${item.recipe.title}`);
  }

  decrementQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartStore.decrementQuantity(item.recipe.uuid);
      this._notificationService.info(`Quantité diminuée pour ${item.recipe.title}`);
    } else {
      this.removeFromCart(item);
    }
  }

  removeFromCart(item: CartItem): void {
    this.cartStore.remove(item.recipe.uuid);
    this._notificationService.warning(`${item.recipe.title} retiré du panier`);
  }

  saveOrderFromCart(): void {
    const items = this.cartStore.items();
    if (items.length > 0) {
      this.saveOrder.emit(items);
    }
  }

  getTotalPrice(): number {
    return this.cartStore.total();
  }

  getItemTotal(item: CartItem): number {
    return item.recipe.price * item.quantity;
  }

  get selectedRecipe(): CartItem[] {
    return this.cartStore.items();
  }
}
