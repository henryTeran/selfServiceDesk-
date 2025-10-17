import { Component, OnInit } from '@angular/core';
import { APIService } from '../../services/api.service';
import { Restaurant } from '../../interfaces';
import { ChoiseService } from '../../services/choise.service';
import { NavController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-choise-order-page',
  imports: [CommonModule],
  templateUrl: './choise-order-page.component.html',
  styleUrl: './choise-order-page.component.css'
})
export class ChoiseOrderPageComponent implements OnInit {
  public RestoInfo?: Restaurant;
  public selectedChoice: number | null = null;

  constructor(
    private readonly _apiService: APIService,
    private _navCtrl: NavController,
    private readonly _choiseService: ChoiseService
  ){}

  async ngOnInit(): Promise<void> {
    this.RestoInfo = await this._apiService.getRecipeWithHpptRequest();
    document.documentElement.style.setProperty('--bg-img', `url(${this.RestoInfo?.photo})`);
  }

  selectChoice(choice: number) {
    this.selectedChoice = choice;
    this._choiseService.setChoice(choice === 1 ? 'emporter' : 'surplace');
    this._navCtrl.navigateForward(['/Menus']);
  }
}
