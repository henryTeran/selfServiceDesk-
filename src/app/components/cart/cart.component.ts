import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Recipe } from '../../interfaces';
import { NotificationService } from '../../services/notifications/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  @Input() selectedRecipe: Recipe[] = [];
  @Output() removeSelectFromCart = new EventEmitter<Recipe>();
  @Output() saveOrder = new EventEmitter<Recipe[]>();
  
  cartOpen = false; // Panier fermé par défaut
  
  toggleCart() {
    this.cartOpen = !this.cartOpen;
  }
 
  constructor(
    private readonly _notificationService: NotificationService
  ) {}

    
    
  removeFromCart(recipe: Recipe) {
    this.removeSelectFromCart.emit(recipe);
    this._notificationService.show(`${recipe.title} retiré du panier !`);
  }

  saveOrderFromCart(recipe: Recipe[]) {
    if (recipe.length > 0) {
      this.saveOrder.emit(recipe);
      this._notificationService.show('Commande en cours de traitement...');
    }
  }

  getTotalPrice(): number {
    return this.selectedRecipe.reduce((sum, item) => sum + item.price, 0);
  }
}
