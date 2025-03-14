import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../interfaces';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() public Categories?: Category[];
  @Output() selectCategory = new EventEmitter<Category>();

  onCategoryClick(category: Category) {
    this.selectCategory.emit(category);
  }

}
