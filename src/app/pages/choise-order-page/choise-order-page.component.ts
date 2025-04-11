import { Component, OnInit } from '@angular/core';
import { APIService } from '../../services/api.service';
import { Restaurant } from '../../interfaces';
import { ChoiseService } from '../../services/choise.service';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonGrid, IonIcon, IonImg, NavController, IonCol, IonRow, IonLabel } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-choise-order-page',
  imports: [CommonModule, IonButton, IonContent, IonIcon, IonImg, IonGrid, IonCol, IonRow, IonLabel],
  templateUrl: './choise-order-page.component.html',
  styleUrl: './choise-order-page.component.css'
})
export class ChoiseOrderPageComponent implements OnInit {
  public RestoInfo? : Restaurant;  

  constructor(
    private readonly _apiService: APIService,
    private _navCtrl: NavController,
    private readonly _choiseService: ChoiseService
    ){}

  async ngOnInit(): Promise<void> {
    this.RestoInfo = await this._apiService.getRecipeWithHpptRequest(); 
    document.documentElement.style.setProperty('--bg-img', `url(${this.RestoInfo?.photo})`);
  }


  // Ajout des choix possibles
  // choices = ['À emporter', 'Sur place'];
  selectedChoice: number| null = null;

  // Méthode pour gérer la sélection
  selectChoice(choice:number) {
     this.selectedChoice = choice;
     console.log(this.selectedChoice)
     if (this.selectedChoice){
        this._choiseService.setChoice("emporter");
     }else{
      this._choiseService.setChoice("surplace");
     }
     
     this._navCtrl.navigateForward(['/Menus']);
   
  }
}
