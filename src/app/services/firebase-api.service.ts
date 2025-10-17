import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { SimplifiedRecipe } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class FirebaseApiService {

  constructor(private _firebase: Firestore) { }

  saveOrder = async (recipes: SimplifiedRecipe[]) => {
    const ref = collection(this._firebase, 'orders');

    return await addDoc(ref, {
      date: new Date(),
      done: false,
      paid: false,
      orders: recipes
    });
  };
}
