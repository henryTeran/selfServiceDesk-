import { Injectable, signal, computed } from '@angular/core';
import { Recipe } from '../interfaces';

const STORAGE_KEY = 'kiosk-cart';

@Injectable({
  providedIn: 'root'
})
export class CartStore {
  private readonly _items = signal<Recipe[]>(this.loadFromStorage());

  public readonly items = this._items.asReadonly();
  public readonly itemCount = computed(() => this._items().length);
  public readonly total = computed(() =>
    this._items().reduce((sum, item) => sum + item.price, 0)
  );

  constructor() {}

  add(recipe: Recipe): void {
    const currentItems = this._items();
    this._items.set([...currentItems, recipe]);
    this.saveToStorage();
  }

  remove(uuid: string): void {
    const currentItems = this._items();
    this._items.set(currentItems.filter(item => item.uuid !== uuid));
    this.saveToStorage();
  }

  clear(): void {
    this._items.set([]);
    this.saveToStorage();
  }

  private loadFromStorage(): Recipe[] {
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
