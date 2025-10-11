import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Recipe } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<Recipe[]>([]);
  public cartItems$: Observable<Recipe[]> = this.cartItemsSubject.asObservable();

  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$: Observable<number> = this.cartCountSubject.asObservable();

  private totalPriceSubject = new BehaviorSubject<number>(0);
  public totalPrice$: Observable<number> = this.totalPriceSubject.asObservable();

  constructor() {}

  addToCart(recipe: Recipe): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = [...currentItems, recipe];
    this.updateCart(updatedItems);
  }

  removeFromCart(recipe: Recipe): void {
    const currentItems = this.cartItemsSubject.value;
    const index = currentItems.findIndex(item => item.uuid === recipe.uuid);

    if (index !== -1) {
      const updatedItems = [...currentItems];
      updatedItems.splice(index, 1);
      this.updateCart(updatedItems);
    }
  }

  clearCart(): void {
    this.updateCart([]);
  }

  getCartItems(): Recipe[] {
    return this.cartItemsSubject.value;
  }

  private updateCart(items: Recipe[]): void {
    this.cartItemsSubject.next(items);
    this.cartCountSubject.next(items.length);

    const total = items.reduce((sum, item) => sum + item.price, 0);
    this.totalPriceSubject.next(total);
  }

  getItemQuantity(uuid: string): number {
    return this.cartItemsSubject.value.filter(item => item.uuid === uuid).length;
  }
}
