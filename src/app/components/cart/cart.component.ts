import { Component, Input } from '@angular/core';
import { Recipe } from '../../interfaces';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  @Input() selectedRecipe: Recipe[] = [];

  // public cart: Recipe[] = [];



  // removeFromCart(recipe: Recipe) {
  //   this.cart = this.cart.filter((item) => item !== recipe);
  //   console.log('Recipe removed from cart');
  // }
}
