import { Component, OnInit } from '@angular/core';
import { APIService } from '../../services/api.service';
import { Restaurant } from '../../interfaces';
import { ChoiseService } from '../../services/choise.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choise-order-page',
  imports: [],
  templateUrl: './choise-order-page.component.html',
  styleUrl: './choise-order-page.component.css'
})
export class ChoiseOrderPageComponent implements OnInit {
  public RestoInfo? : Restaurant;  

  constructor(
    private readonly _apiService: APIService,
    private readonly _router: Router,
    private readonly _choiseService: ChoiseService
    ){}

  async ngOnInit(): Promise<void> {
    this.RestoInfo = await this._apiService.getRecipeWithHpptRequest(); 
  }


  // Ajout des choix possibles
  choices = ['À emporter', 'Sur place'];
  selectedChoice: string | null = null;

  // Méthode pour gérer la sélection
  selectChoice(choice: string) {
    this.selectedChoice = choice;
    this._choiseService.setChoice(choice);
    this._router.navigate(['/Menus']);
   
  }
}
