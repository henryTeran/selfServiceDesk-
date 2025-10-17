import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular/standalone';
import { APIService } from '../../services/api.service';
import { SupabaseApiService } from '../../services/supabase-api.service';
import { CartStore } from '../../services/cart-store.service';
import { NotificationService } from '../../services/notifications/notification.service';
import { ChoiseService } from '../../services/choise.service';
import { Category, Recipe, Restaurant, SimplifiedRecipe, CartItem } from '../../interfaces';
import { CartComponent } from '../../components/cart/cart.component';
import { NotificationComponent } from '../../components/notification/notification.component';
import { ProductQuantityModalComponent } from '../../components/product-quantity-modal/product-quantity-modal.component';
import { PricePipe } from '../../pipes/price.pipe';

@Component({
  selector: 'app-order-page',
  imports: [
    CommonModule,
    CartComponent,
    NotificationComponent,
    PricePipe
  ],
  templateUrl: './order-page.html',
  styleUrls: ['./order-page.css']
})
export class OrderPage implements OnInit {
  public RestoInfo$!: Observable<Restaurant | null>;
  public Categories$!: Observable<Category[]>;
  public selectedCategory$!: Observable<Category | null>;
  public isCartOpen = false;

  get cartItemCount(): number {
    return this._cartStore.itemCount();
  }

  constructor(
    private readonly _apiService: APIService,
    private readonly _supabaseService: SupabaseApiService,
    private readonly _cartStore: CartStore,
    private readonly _notificationService: NotificationService,
    private readonly _choiseService: ChoiseService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _modalCtrl: ModalController
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

  async addRecipeToCart(recipe: Recipe): Promise<void> {
    const modal = await this._modalCtrl.create({
      component: ProductQuantityModalComponent,
      componentProps: {
        product: recipe
      },
      breakpoints: [0, 0.5, 0.75, 1],
      initialBreakpoint: 0.75
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      this._cartStore.add(data.product, data.quantity);
      this._notificationService.success(`${data.product.title} ajouté au panier (quantité : ${data.quantity})`);
      this.isCartOpen = true;
    }
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  closeCart(): void {
    this.isCartOpen = false;
  }

  async saveOrder(items: CartItem[]): Promise<void> {
    if (items.length === 0) {
      this._notificationService.warning('Le panier est vide !');
      return;
    }

    const orderDataFormat: SimplifiedRecipe[] = items.flatMap(item =>
      Array(item.quantity).fill({
        uuid: item.recipe.uuid,
        title: item.recipe.title,
        description: item.recipe.description,
        price: item.recipe.price,
        imageUrl: item.recipe.imageUrl
      })
    );

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
