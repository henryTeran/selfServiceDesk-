import { Component, EventEmitter, Output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../interfaces';
import { NotificationService } from '../../services/notifications/notification.service';
import { CartStore } from '../../services/cart-store.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  @Output() saveOrder = new EventEmitter<Recipe[]>();

  cartOpen = false;

  constructor(
    private readonly _notificationService: NotificationService,
    public readonly cartStore: CartStore
  ) {}

  toggleCart(): void {
    this.cartOpen = !this.cartOpen;
  }

  removeFromCart(recipe: Recipe): void {
    this.cartStore.remove(recipe.uuid);
    this._notificationService.info(`${recipe.title} retiré du panier !`);
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

  get selectedRecipe(): Recipe[] {
    return this.cartStore.items();
  }
}
