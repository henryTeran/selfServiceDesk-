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
import { SupabaseService } from '../../services/supabase.service';
import { CartService } from '../../services/cart.service';
import { ChoiseService } from '../../services/choise.service';
import { NavController } from '@ionic/angular/standalone';
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
  public selectedRecipe$!: Observable<Recipe[]>;
  public currentRoute$!: Observable<string>;

  constructor(
    private readonly _apiService: APIService,
    private readonly _supabaseService: SupabaseService,
    private readonly _cartService: CartService,
    private readonly _choiseService: ChoiseService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _navCtrl: NavController
  ) { }

  ngOnInit()  {
    this.Categories$ = this._apiService.data$.pipe(
      map((data) => {
        return data?.data;
      })
    );

    this.RestoInfo$ = this._apiService.data$;
    this.selectedRecipe$ = this._cartService.cartItems$;

    firstValueFrom(this._activatedRoute.paramMap).then(params => {
      const uuid = params.get('uuid');
      if (uuid) {
        const category = this._apiService.data$.pipe(
          map(data => data?.data?.find(cat => cat.uuid === uuid) || null)
        );

        firstValueFrom(category).then(cat => {
          if (cat) {
            this.selectCategory(cat);
          }
        });
      }
    });
  }
   // Fonction appelée lors du clic sur une catégorie
  selectCategory(category: Category) {
    this._apiService.selectCategory(category);
    this.selectedCategory$ = this._apiService.selectedCategory$;
    console.log('Catégorie sélectionnée:', this.selectedCategory$);
  }

  addRecipeToCart(recipe: Recipe) {
    this._cartService.addToCart(recipe);
  }

  removeFromCart(recipe: Recipe) {
    this._cartService.removeFromCart(recipe);
  }

  async saveOrder(recipes: Recipe[]) {
    const orderDataFormat: SimplifiedRecipe[] = recipes.map(r => ({
      uuid: r.uuid,
      title: r.title,
      description: r.description,
      price: r.price
    }));

    const orderType = await firstValueFrom(this._choiseService.choise$) || 'surplace';
    const { order, error } = await this._supabaseService.saveOrder(orderDataFormat, orderType);

    if (!error && order) {
      this._cartService.clearCart();
      this._navCtrl.navigateForward(['/validation', order.id]);
    } else {
      console.error('Erreur lors de l\'enregistrement de la commande:', error);
    }
  }
  

  
}
