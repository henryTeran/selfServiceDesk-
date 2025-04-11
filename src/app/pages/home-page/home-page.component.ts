import { Component, OnInit } from '@angular/core';
import { APIService } from '../../services/api.service';
import { Restaurant } from '../../interfaces';
import { Router } from '@angular/router';
import { IonAvatar, IonButton, IonContent, IonImg, IonItem, IonLabel, IonNote, NavController } from '@ionic/angular/standalone';
@Component({
  selector: 'app-home-page',
  imports: [IonButton, IonContent, IonImg, IonLabel, IonItem, IonNote,  IonAvatar],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit{
   public RestoInfo? : Restaurant;
  

  constructor (
    private _apiService: APIService,
    private _navCtrl: NavController){} 

  async ngOnInit () {
    const data = await this._apiService.getRecipeWithHpptRequest(); 
    console.log(data)
    this.RestoInfo = data;
    document.documentElement.style.setProperty('--bg-img', `url(${this.RestoInfo?.photo})`);
    
  }

  startOrdering() {
    this._navCtrl.navigateForward('/choiseOrder'); 
  }

}
