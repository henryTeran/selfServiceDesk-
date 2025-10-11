import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { SimplifiedRecipe } from '../interfaces';
import { BehaviorSubject, from, Observable } from 'rxjs';

export interface Order {
  id?: string;
  order_number?: number;
  order_type: string;
  status: string;
  total_price: number;
  paid: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id?: string;
  order_id: string;
  item_uuid: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private currentOrderSubject = new BehaviorSubject<Order | null>(null);
  public currentOrder$ = this.currentOrderSubject.asObservable();

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
  }

  async saveOrder(
    recipes: SimplifiedRecipe[],
    orderType: string = 'surplace'
  ): Promise<{ order: Order | null; error: any }> {
    try {
      const totalPrice = recipes.reduce((sum, item) => sum + item.price, 0);

      const { data: order, error: orderError } = await this.supabase
        .from('orders')
        .insert({
          order_type: orderType,
          status: 'pending',
          total_price: totalPrice,
          paid: false
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = recipes.map(recipe => ({
        order_id: order.id,
        item_uuid: recipe.uuid,
        title: recipe.title,
        description: recipe.description,
        price: recipe.price,
        quantity: 1
      }));

      const { error: itemsError } = await this.supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      this.currentOrderSubject.next(order);
      return { order, error: null };
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la commande:', error);
      return { order: null, error };
    }
  }

  getOrderById(orderId: string): Observable<any> {
    return from(
      this.supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('id', orderId)
        .single()
    );
  }

  getTodayOrders(): Observable<any> {
    const today = new Date().toISOString().split('T')[0];
    return from(
      this.supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .gte('created_at', today)
        .order('created_at', { ascending: false })
    );
  }

  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    return await this.supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
  }

  async updateOrderPayment(orderId: string, paid: boolean): Promise<any> {
    return await this.supabase
      .from('orders')
      .update({ paid })
      .eq('id', orderId);
  }

  clearCurrentOrder(): void {
    this.currentOrderSubject.next(null);
  }
}
