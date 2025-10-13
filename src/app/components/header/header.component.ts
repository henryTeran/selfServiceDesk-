import { Component, Input } from '@angular/core';
import { Restaurant } from '../../interfaces';


@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() public RestoInfo?: Restaurant;

  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}
}
