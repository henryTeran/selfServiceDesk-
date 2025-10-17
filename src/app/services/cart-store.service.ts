import { Injectable, signal, computed } from '@angular/core';
import { Recipe, CartItem } from '../interfaces';

const STORAGE_KEY = 'kiosk-cart';

@Injectable({
  providedIn: 'root'
})
export class CartStore {
  private readonly _items = signal<CartItem[]>(this.loadFromStorage());

  public readonly items = computed(() => this._items());

  public readonly itemCount = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );

  public readonly total = computed(() =>
    this._items().reduce((sum, item) => sum + (item.recipe.price * item.quantity), 0)
  );

  constructor() {}

  add(recipe: Recipe, quantity: number = 1): void {
    const currentItems = this._items();
    const existingIndex = currentItems.findIndex(item => item.recipe.uuid === recipe.uuid);

    if (existingIndex !== -1) {
      const updated = [...currentItems];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + quantity
      };
      this._items.set(updated);
    } else {
      this._items.set([...currentItems, { recipe, quantity }]);
    }

    this.saveToStorage();
  }

  updateQuantity(uuid: string, quantity: number): void {
    if (quantity <= 0) {
      this.remove(uuid);
      return;
    }

    const currentItems = this._items();
    const updated = currentItems.map(item =>
      item.recipe.uuid === uuid ? { ...item, quantity } : item
    );
    this._items.set(updated);
    this.saveToStorage();
  }

  incrementQuantity(uuid: string): void {
    const currentItems = this._items();
    const item = currentItems.find(i => i.recipe.uuid === uuid);
    if (item) {
      this.updateQuantity(uuid, item.quantity + 1);
    }
  }

  decrementQuantity(uuid: string): void {
    const currentItems = this._items();
    const item = currentItems.find(i => i.recipe.uuid === uuid);
    if (item) {
      this.updateQuantity(uuid, item.quantity - 1);
    }
  }

  remove(uuid: string): void {
    const currentItems = this._items();
    this._items.set(currentItems.filter(item => item.recipe.uuid !== uuid));
    this.saveToStorage();
  }

  clear(): void {
    this._items.set([]);
    this.saveToStorage();
  }

  private loadFromStorage(): CartItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erreur lors du chargement du panier :', error);
      return [];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items()));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du panier :', error);
    }
  }
}
