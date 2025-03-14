import { Component, Input } from '@angular/core';
import { Category } from '../../interfaces';


@Component({
  selector: 'app-recipe',
  imports: [],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.css'
})
export class RecipeComponent {
  @Input() public selectedCategory?: Category;

}
