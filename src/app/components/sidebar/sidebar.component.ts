
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() public Categories!: Category[];
  @Output() selectCategory = new EventEmitter<Category>();

  sidebarOpen = false; // Caché par défaut sur mobile

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  onCategoryClick(category: Category) {
    this.selectCategory.emit(category);
    this.sidebarOpen = false; // Ferme la sidebar après sélection sur mobile
  }

}
