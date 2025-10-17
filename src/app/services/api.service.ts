import { HttpClient } from "@angular/common/http";
import { Category, Recipe, Restaurant } from "../interfaces";
import { Injectable } from "@angular/core";
import { BehaviorSubject, firstValueFrom, map, Observable, shareReplay } from "rxjs";

@Injectable ({
  providedIn: 'root'
})

export class APIService  {
  selectedRecipe: Recipe[] = [];
  loading = true;

  private readonly _data$ = new BehaviorSubject<Restaurant | null>(null); 
  private readonly _photoResto$ = new BehaviorSubject<string>(""); 
  private readonly _selectedCategory$ = new BehaviorSubject<Category | null>(null); 
  public readonly data$ = this._data$.asObservable().pipe(shareReplay(1));
  public readonly photoResto$ = this._photoResto$.asObservable().pipe(shareReplay(1));
  public readonly selectedCategory$ = this._selectedCategory$.asObservable().pipe(shareReplay(1));



 
  constructor(private readonly http : HttpClient) {}

  async getRecipeWithHpptRequest(): Promise<Restaurant | undefined> {
    const existingData = this._data$.value;
    if (existingData) {
      return existingData;
    }
  
    try {
      const url = 'assets/data/resto-data.json';
      const request = this.http.get<Restaurant>(url);
      const response = await firstValueFrom(request);
      this._data$.next(response);
      this._photoResto$.next(response.photo);
      return response;
    } catch (error) {
      console.error('Erreur lors du chargement des données :', error);
      return undefined;
    }
  }
  getCategories(): Observable<Category[]> {
    return this.data$.pipe(
      map((data) => data?.data || [])
    );
  }

  getCategoryByUuid(uuid: string): Observable<Category | null> {
    return this.data$.pipe(
      map((data) => {
        if (!data?.data) return null;
        return data.data.find(cat => cat.uuid === uuid) || null;
      })
    );
  }

  selectCategory(category: Category): void {
    this._selectedCategory$.next(category);
  }



  addToCart(recipe: Recipe): Recipe[] {
    this.selectedRecipe.push(recipe);
    return this.selectedRecipe;
  }

  removeFromCart(recipe: Recipe): Recipe[] {
    this.selectedRecipe = this.selectedRecipe.filter(item => item.uuid !== recipe.uuid);
    return this.selectedRecipe;
  }
  
}
