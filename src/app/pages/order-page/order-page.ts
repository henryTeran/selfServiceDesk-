import { Component, OnInit } from '@angular/core';

import { APIService } from '../../services/api.service';
import { HeaderComponent } from '../../components/header/header.component';
import { Category, Recipe, Restaurant } from '../../interfaces';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RecipeComponent } from '../../components/recipe/recipe.component';
import { CartComponent } from '../../components/cart/cart.component';



@Component({
  selector: 'app-order-page',
  imports: [HeaderComponent, SidebarComponent, FooterComponent, RecipeComponent, CartComponent ], // Ajoute CommonModule pour activer *ngIf
  templateUrl: './order-page.html',
  styleUrls: ['./order-page.css']
})
export class OrderPage implements OnInit {
  public RestoInfo? : Pick<Restaurant, 'title' | 'photo' | 'etaRange' | 'location'>;
  public Categories: Category[] = [];
  public selectedCategory?: Category;
  public selectedRecipe: Recipe[] = [];


  constructor() {}

  async ngOnInit()  {
    const result = await new APIService().getRecipes();
    console.log(result);
    if (result === undefined) {
      return;
    }
    this.RestoInfo = { 
      title: result.title ,
      photo: result.photo,
      etaRange: result.etaRange,
      location: result.location,
    }

    if (result.data && Array.isArray(result.data)) {
      this.Categories = result.data; // Stocke des objets Category entiers
    }
    console.log(this.Categories);

    this.selectedCategory = new APIService().selectedCategory ?? undefined;
      console.log(this.selectedCategory);

    this.selectedRecipe = []; // Initialize as an empty array or assign the correct value
  }
   // Fonction appelée lors du clic sur une catégorie
   selectCategory(category: Category) {
    this.selectedCategory = category;
    new APIService().selectCategory(category);
    console.log('Catégorie sélectionnée:', this.selectedCategory);
  }

  addRecipeToCart(recipe: Recipe) {
    if (!this.selectedRecipe) {
      this.selectedRecipe = []; // Assure qu'on a bien un tableau
    }
    this.selectedRecipe.push(recipe);
    console.log('Selected Recipes:', this.selectedRecipe);
  }
  
  
}
