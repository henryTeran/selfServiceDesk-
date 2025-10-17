import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular/standalone';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonFooter } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, add, remove } from 'ionicons/icons';
import { Recipe } from '../../interfaces';
import { PricePipe } from '../../pipes/price.pipe';

@Component({
  selector: 'app-product-quantity-modal',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonFooter,
    PricePipe
  ],
  templateUrl: './product-quantity-modal.component.html',
  styleUrls: ['./product-quantity-modal.component.css']
})
export class ProductQuantityModalComponent {
  @Input() product!: Recipe;

  quantity = 1;

  constructor(private modalCtrl: ModalController) {
    addIcons({ close, add, remove });
  }

  increment(): void {
    if (this.quantity < 99) {
      this.quantity++;
    }
  }

  decrement(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  dismiss(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm(): void {
    this.modalCtrl.dismiss({
      product: this.product,
      quantity: this.quantity
    }, 'confirm');
  }

  getTotalPrice(): number {
    return this.product.price * this.quantity;
  }
}
