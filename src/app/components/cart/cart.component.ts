import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Recipe } from '../../interfaces';
import { NotificationService } from '../../services/notifications/notification.service';
import { FirebeseApiService } from '../../services/firebese-api.service';

@Component({
  selector: 'app-cart',
  imports: [],
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
    private readonly _notificationService: NotificationService,
    private readonly _apiFirebase: FirebeseApiService
  ) {}

    
    
  removeFromCart(recipe: Recipe) {
    this.removeSelectFromCart.emit(recipe);
    this._notificationService.show(`${recipe.title} retiré du panier !`);
    console.log(this._notificationService.messages);
   }

  saveOrderFromCart(recipe:Recipe[]) {
    this.saveOrder.emit(recipe);
    console.log("bouton licl")

  }

  getTotalPrice(): number {
    return this.selectedRecipe.reduce((sum, item) => sum + item.price, 0);
  }
  


}

///revoir reactif programming !!!!!!
