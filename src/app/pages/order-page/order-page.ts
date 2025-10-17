import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, Observable, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { APIService } from '../../services/api.service';
import { FirebaseApiService } from '../../services/firebase-api.service';
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
  public selectedRecipe: Recipe[] = [];

  constructor(
    private readonly _apiService: APIService,
    private readonly _firebaseService: FirebaseApiService,
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
    this.selectedRecipe = this._apiService.addToCart(recipe);
  }

  removeFromCart(recipe: Recipe): void {
    this.selectedRecipe = this._apiService.removeFromCart(recipe);
  }

  async saveOrder(recipes: Recipe[]): Promise<void> {
    const orderDataFormat: SimplifiedRecipe[] = recipes.map(r => ({
      uuid: r.uuid,
      title: r.title,
      description: r.description,
      price: r.price,
      imageUrl: r.imageUrl
    }));

    await this._firebaseService.saveOrder(orderDataFormat);
    this.selectedRecipe = [];
  }
}
