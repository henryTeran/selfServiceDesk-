import { Component, Input } from '@angular/core';
import { Category } from '../../interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe',
  imports: [CommonModule],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.css'
})
export class RecipeComponent {
  @Input() public selectedCategory?: Category;

}
