import { Component, OnInit } from '@angular/core';
import { APIService } from '../../services/api.service';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-dashboard-page',
  imports: [CommonModule],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent implements OnInit {
  categories$!: Observable<{ name: string; image: string | null; uuid: string }[]>;
  photo$!: Observable<string>;

  constructor(
    private readonly _apiService: APIService,
    private _navCtrl: NavController
  ){}

  async ngOnInit(): Promise<void> {
    await this._apiService.getRecipeWithHpptRequest();

    this.categories$ = this._apiService.getCategories().pipe(
      map((categories) =>
        categories
          .filter(cat => cat.recipes && cat.recipes.length > 0)
          .map(cat => ({
            name: cat.title,
            image: cat.recipes?.[0]?.imageUrl || null,
            uuid: cat.uuid
          }))
      )
    );

    this.photo$ = this._apiService.photoResto$;
  }

  onMenuItemClick(uuid: string): void {
    this._navCtrl.navigateForward(['/order', uuid]);
  }
}
