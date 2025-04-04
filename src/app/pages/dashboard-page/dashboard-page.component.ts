import { Component, OnInit, output } from '@angular/core';
import { APIService } from '../../services/api.service';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  imports: [CommonModule],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent implements OnInit {
  categories$!: Observable<{ name: string; image: string | null; uuid: string }[]>;
  photo$!: Observable<string>;

  // @output

  constructor(private readonly _apiService: APIService, private router: Router){}

  ngOnInit(): void {
    this.categories$ = this._apiService.data$.pipe(
      map((res: any) => res.data), // ← récupère le vrai tableau
      map((categories: any[]) =>
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
    console.log(this.photo$);
    
  }

  onMenuItemClick(uuid: string): void {
    console.log("clic", uuid);
    this.router.navigate(['/order', uuid]);
  }
}
