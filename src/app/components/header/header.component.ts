import { Component, Input } from '@angular/core';
import { Restaurant } from '../../interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() public RestoInfo?: Pick<Restaurant, 'title' | 'photo' | 'etaRange' | 'location'>;


}
