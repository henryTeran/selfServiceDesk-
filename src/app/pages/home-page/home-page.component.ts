import { Component, OnInit } from '@angular/core';
import { APIService } from '../../services/api.service';
import { Restaurant } from '../../interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit{
   public RestoInfo? : Restaurant;
  

  constructor (
    private _apiService: APIService,
    private router: Router){} 

  async ngOnInit () {
    const data = await this._apiService.getRecipeWithHpptRequest(); 
    console.log(data)
    this.RestoInfo = data;
    
  }

  navigate(path: string): void {
    console.log(path);
    this.router.navigate([path]);
  }

}
