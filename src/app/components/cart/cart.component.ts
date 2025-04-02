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
  
  test = this.selectedRecipe; 
  
  constructor(
    private notificationService: NotificationService,
    private readonly _apiFirebase: FirebeseApiService) {
      console.log('test' , this.test); 
    }
    
    
  removeFromCart(recipe: Recipe) {
    this.removeSelectFromCart.emit(recipe);
    this.notificationService.addMessage(`${recipe.title} retiré du panier !`);
    console.log(this.notificationService.messages);
   }

   saveOrderFromCart(recipe:Recipe[]) {
    this.saveOrder.emit(recipe);
    console.log("bouton licl")

   }




}

///revoir reactif programming !!!!!!
