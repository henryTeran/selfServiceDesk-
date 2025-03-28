import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Recipe } from '../../interfaces';
import { NotificationService } from '../../services/notifications/notification.service';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  @Input() selectedRecipe: Recipe[] = [];
  @Output() removeSelectFromCart = new EventEmitter<Recipe>();

  cartOpen = false; // Panier fermé par défaut

  toggleCart() {
    this.cartOpen = !this.cartOpen;
  }

  constructor(private notificationService: NotificationService) {}

  removeFromCart(recipe: Recipe) {
    this.removeSelectFromCart.emit(recipe);
    this.notificationService.addMessage(`${recipe.title} retiré du panier !`);
    console.log(this.notificationService.messages);
   }



}
