import { HttpClient, HttpRequest } from "@angular/common/http";
import { Category, Recipe, Restaurant } from "../interfaces";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

@Injectable ({
  providedIn: 'root'
})

export class APIService  {
  restaurants: Restaurant | null = null;
  selectedCategory: Category | null = null;
  selectedRecipe: Recipe[] = [];
  loading = true;
 
  constructor(private readonly http : HttpClient) {}

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

  async getRecipeWithHpptRequest () : Promise<Restaurant | undefined> {
    try {
      const url = 'assets/data/resto-data.json'
      const request = this.http.get <Restaurant> (url); 
      const reponse = await firstValueFrom(request); 
     return reponse;
    } catch (error) {
      console.error('Erreur lors du chargement des données :', error);
      return undefined;
    }
  }
  selectCategory(category: Category): void {
    this.selectedCategory = category;
  }



  addToCart(recipe: Recipe): Recipe[] {
    this.selectedRecipe.push(recipe);
    return this.selectedRecipe;
  }

  removeFromCart(recipe: Recipe): Recipe[] {
    this.selectedRecipe = this.selectedRecipe.filter(item => item.uuid !== recipe.uuid);
    return this.selectedRecipe;
  }
  
}
