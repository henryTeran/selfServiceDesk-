import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore, onSnapshot, query, getDocs, doc, updateDoc, getDoc } from '@angular/fire/firestore';
import { SimplifiedRecipe } from '../interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebeseApiService {
  private unsubscribe: (() => void) | null = null;

  constructor(private _firebase: Firestore) { }

  saveOrder = async (recipes: SimplifiedRecipe[], orderType?: string, paymentMethod?: string) => {
    const ref = collection(this._firebase, 'orders');
    const docRef = await addDoc(ref, {
      date: new Date(),
      done: false,
      paid: false,
      orders: recipes,
      orderType: orderType || 'standard',
      paymentMethod: paymentMethod || 'cash'
    });

    return {
      id: docRef.id,
      order_number: docRef.id.substring(0, 8).toUpperCase()
    };
  };

  subscribeToOrders = (): Observable<any> => {
    return new Observable(observer => {
      const q = query(collection(this._firebase, 'orders'));
      this.unsubscribe = onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        observer.next(orders);
      }, (error) => {
        observer.error(error);
      });
      return () => {
        if (this.unsubscribe) this.unsubscribe();
      };
    });
  };

  unsubscribeFromOrders = (): void => {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  };

  getOrders = async (): Promise<any[]> => {
    const q = query(collection(this._firebase, 'orders'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  };

  getOrderById = async (orderId: string): Promise<any> => {
    const docRef = doc(this._firebase, 'orders', orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    }
    return null;
  };

  updateOrderStatus = async (orderId: string, status: string): Promise<void> => {
    const docRef = doc(this._firebase, 'orders', orderId);
    await updateDoc(docRef, {
      done: status === 'validated',
      paid: status === 'paid'
    });
  };
}
