import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChoiseService {
  private choiseOrder = new BehaviorSubject < string |null> (null); 
  public choise$: Observable<string | null> = this.choiseOrder.asObservable()

  setChoice(choice: string): void {
    this.choiseOrder.next(choice);
  }


  constructor() { }
}
