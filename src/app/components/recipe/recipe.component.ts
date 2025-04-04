import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category, Recipe } from '../../interfaces';
import { NotificationService } from '../../services/notifications/notification.service';


@Component({
  selector: 'app-recipe',
  imports: [],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.css'
})
export class RecipeComponent {
  @Input() public selectedCategory?: Category;
  @Output() selectRecipe = new EventEmitter<Recipe>();
  public selectedRecipe: Recipe[] = [];
  
  constructor(private notificationService: NotificationService) {}
  addToCart(recipe: Recipe) {
    this.selectRecipe.emit(recipe);  
    this.notificationService.show(`${recipe.title} ajouté au panier !`);
    console.log(this.notificationService.messages)

  }
}
