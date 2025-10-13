import { Component, OnInit } from '@angular/core';
import { APIService } from '../../services/api.service';
import { HeaderComponent } from '../../components/header/header.component';
import { Category, Recipe, Restaurant, SimplifiedRecipe } from '../../interfaces';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RecipeComponent } from '../../components/recipe/recipe.component';
import { CartComponent } from '../../components/cart/cart.component';
import { NotificationComponent } from '../../components/notification/notification.component';
import { firstValueFrom, map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FirebeseApiService } from '../../services/firebese-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-page',
  imports: [HeaderComponent, SidebarComponent, FooterComponent, RecipeComponent, CartComponent, NotificationComponent, CommonModule], 
  templateUrl: './order-page.html',
  styleUrls: ['./order-page.css']
})


export class OrderPage implements OnInit {
  public RestoInfo$!: Observable<Restaurant | null>;
  public Categories$!: Observable<Category[] | undefined>;
  public selectedCategory$?: Observable<Category | null>;
  public selectedRecipe: Recipe[] = [];
  public currentRoute$!: Observable<string>; // Observable pour la route actuelle

  constructor(
    private readonly _apiService: APIService, 
    private readonly _firebaseService: FirebeseApiService, 
    private readonly _activatedRoute: ActivatedRoute
  ) { }

  ngOnInit()  {
    this.Categories$ = this._apiService.data$.pipe(
      map((data) => {
        return data?.data;
      })
    );

    this.RestoInfo$ = this._apiService.data$;

    // Ou version avec firstValueFrom
    firstValueFrom(this._activatedRoute.paramMap).then(params => {
      const uuid = params.get('uuid');
      console.log('From firstValueFrom →', uuid);
    });
   
  }
   // Fonction appelée lors du clic sur une catégorie
  selectCategory(category: Category) {
    this._apiService.selectCategory(category);
    this.selectedCategory$ = this._apiService.selectedCategory$;
    console.log('Catégorie sélectionnée:', this.selectedCategory$);
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

  
  async saveOrder(recipes: Recipe[]) {
    const orderDataFormat: SimplifiedRecipe[] = recipes.map(r => ({
      uuid: r.uuid,
      title: r.title,
      description: r.description,
      price: r.price,
      imageUrl: r.imageUrl
    }));
  
    const result = await this._firebaseService.saveOrder(orderDataFormat);
    console.log('Commandes enregistrées :', result);
    this.selectedRecipe = []; // vider le panier si tu veux
  }
  

  
}
