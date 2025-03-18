import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category, Recipe } from '../../interfaces';


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
  
  addToCart(recipe: Recipe) {
    this.selectRecipe.emit(recipe);  
  }
 


  

}
