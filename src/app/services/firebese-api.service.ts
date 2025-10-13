import { Injectable } from '@angular/core';
import { addDoc, collection, doc, Firestore, writeBatch } from '@angular/fire/firestore';
import { Recipe, SimplifiedRecipe } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class FirebeseApiService {

  constructor(private _firebase: Firestore) { } 


  saveOrder = async (recipes: SimplifiedRecipe[]) => {
    const ref = collection(this._firebase, 'orders');

    // Enregistrer toute la commande dans un seul document
    return await addDoc(ref, {
      date: new Date(),
      done: false,
      paid: false,
      orders: recipes
    });
  };
  



}
