import { Component, OnInit } from '@angular/core';
import { APIService } from '../../services/api.service';
import { HeaderComponent } from '../../components/header/header.component';
import { Category, Recipe, Restaurant } from '../../interfaces';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RecipeComponent } from '../../components/recipe/recipe.component';
import { CartComponent } from '../../components/cart/cart.component';
import { NotificationComponent } from '../../components/notification/notification.component';

@Component({
  selector: 'app-order-page',
  imports: [HeaderComponent, SidebarComponent, FooterComponent, RecipeComponent, CartComponent, NotificationComponent], 
  templateUrl: './order-page.html',
  styleUrls: ['./order-page.css']
})


export class OrderPage implements OnInit {
  public RestoInfo? : Pick<Restaurant, 'title' | 'photo' | 'etaRange' | 'location'>;
  public Categories: Category[] = [];
  public selectedCategory?: Category;
  public selectedRecipe: Recipe[] = [];



  constructor(private readonly _apiService: APIService) {}

  async ngOnInit()  {
    const result = await this._apiService.getRecipeWithHpptRequest();
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
  }
   // Fonction appelée lors du clic sur une catégorie
  selectCategory(category: Category) {
    this.selectedCategory = category;
    this._apiService.selectCategory(category);
    console.log('Catégorie sélectionnée:', this.selectedCategory);
  }

  // Fonction appelée lors du clic sur un recete à ajouter au cart
  addRecipeToCart(recipe: Recipe) {
    if (!this.selectedRecipe) {
      this.selectedRecipe = []; // Assure qu'on a bien un tableau
    }
    this.selectedRecipe = this._apiService.addToCart(recipe);
    console.log("Return servie", this.selectedRecipe);
  }

  removeFromCart (recipe: Recipe) {
    this.selectedRecipe = this._apiService.removeFromCart(recipe); 
  }
  
  
}
