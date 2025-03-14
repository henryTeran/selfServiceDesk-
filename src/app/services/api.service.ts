import { Category, Recipe, Restaurant } from "../interfaces";

export class APIService  {
  restaurants: Restaurant | null = null;
  selectedCategory: Category | null = null;
  cart: Recipe[] = [];
  loading = true;


  async getRecipes(): Promise<Restaurant | undefined> {
    try {
      const response = await fetch('assets/data/resto-data.json');
      const reponse: Restaurant = await response.json();
      return reponse;
    } catch (error) {
      console.error('Erreur lors du chargement des données :', error);
      return undefined;
    }
  }

  selectCategory(category: Category): void {
    this.selectedCategory = category;
  }

  addToCart(recipe: Recipe): void {
    this.cart.push(recipe);
  }

  removeFromCart(recipe: Recipe): void {
    this.cart = this.cart.filter(item => item.uuid !== recipe.uuid);
  }
  
}
