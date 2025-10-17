import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { APIService } from '../../services/api.service';
import { SupabaseApiService } from '../../services/supabase-api.service';
import { CartStore } from '../../services/cart-store.service';
import { NotificationService } from '../../services/notifications/notification.service';
import { ChoiseService } from '../../services/choise.service';
import { Category, Recipe, Restaurant, SimplifiedRecipe } from '../../interfaces';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RecipeComponent } from '../../components/recipe/recipe.component';
import { CartComponent } from '../../components/cart/cart.component';
import { NotificationComponent } from '../../components/notification/notification.component';

@Component({
  selector: 'app-order-page',
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    RecipeComponent,
    CartComponent,
    NotificationComponent
  ],
  templateUrl: './order-page.html',
  styleUrls: ['./order-page.css']
})
export class OrderPage implements OnInit {
  public RestoInfo$!: Observable<Restaurant | null>;
  public Categories$!: Observable<Category[]>;
  public selectedCategory$!: Observable<Category | null>;

  constructor(
    private readonly _apiService: APIService,
    private readonly _supabaseService: SupabaseApiService,
    private readonly _cartStore: CartStore,
    private readonly _notificationService: NotificationService,
    private readonly _choiseService: ChoiseService,
    private readonly _activatedRoute: ActivatedRoute
  ) { }

  async ngOnInit(): Promise<void> {
    await this._apiService.getRecipeWithHpptRequest();

    this.RestoInfo$ = this._apiService.data$;
    this.Categories$ = this._apiService.getCategories();

    const params = await firstValueFrom(this._activatedRoute.paramMap);
    const uuid = params.get('uuid');

    if (uuid) {
      this.selectedCategory$ = this._apiService.getCategoryByUuid(uuid);
      const category = await firstValueFrom(this.selectedCategory$);
      if (category) {
        this._apiService.selectCategory(category);
      }
    } else {
      this.selectedCategory$ = this._apiService.selectedCategory$;
    }
  }

  selectCategory(category: Category): void {
    this._apiService.selectCategory(category);
    this.selectedCategory$ = this._apiService.selectedCategory$;
  }

  addRecipeToCart(recipe: Recipe): void {
    this._cartStore.add(recipe);
  }

  async saveOrder(recipes: Recipe[]): Promise<void> {
    if (recipes.length === 0) {
      this._notificationService.warning('Le panier est vide !');
      return;
    }

    const orderDataFormat: SimplifiedRecipe[] = recipes.map(r => ({
      uuid: r.uuid,
      title: r.title,
      description: r.description,
      price: r.price,
      imageUrl: r.imageUrl
    }));

    try {
      const orderType = await firstValueFrom(this._choiseService.choise$) || 'emporter';
      const result = await this._supabaseService.saveOrder(orderDataFormat, orderType);

      if (result) {
        this._notificationService.success(`Commande ${result.order_number} envoyée avec succès !`);
        this._cartStore.clear();
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la commande :', error);
      this._notificationService.error('Erreur lors de l\'envoi de la commande');
    }
  }
}
