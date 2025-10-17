import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { SimplifiedRecipe } from '../interfaces';
import { Subject, Observable } from 'rxjs';

interface OrderInsert {
  items: SimplifiedRecipe[];
  total_price: number;
  order_type: string;
  payment_method?: string;
}

interface OrderResponse {
  id: string;
  order_number: string;
  items: SimplifiedRecipe[];
  total_price: number;
  order_type: string;
  payment_method?: string;
  status: string;
  created_at: string;
}

export type OrderChangeEvent = {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: OrderResponse | null;
  old: OrderResponse | null;
};

@Injectable({
  providedIn: 'root'
})
export class SupabaseApiService {
  private supabase: SupabaseClient;
  private ordersChannel: RealtimeChannel | null = null;
  private orderChanges$ = new Subject<OrderChangeEvent>();

  constructor() {
    const supabaseUrl = 'https://spyaoxtsznaodazdvajw.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNweWFveHRzem5hb2RhemR2YWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NDU2NDEsImV4cCI6MjA3NjIyMTY0MX0.IRI83qpDKifTJ2N0VR-Jye2bH3mLubJavXXkOVSMxMc';

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  subscribeToOrders(): Observable<OrderChangeEvent> {
    if (!this.ordersChannel) {
      this.ordersChannel = this.supabase
        .channel('orders-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders' },
          (payload: any) => {
            const event: OrderChangeEvent = {
              eventType: payload.eventType,
              new: payload.new as OrderResponse | null,
              old: payload.old as OrderResponse | null
            };
            this.orderChanges$.next(event);
          }
        )
        .subscribe();
    }

    return this.orderChanges$.asObservable();
  }

  unsubscribeFromOrders(): void {
    if (this.ordersChannel) {
      this.supabase.removeChannel(this.ordersChannel);
      this.ordersChannel = null;
    }
  }

  async saveOrder(
    items: SimplifiedRecipe[],
    orderType: string = 'emporter',
    paymentMethod?: string
  ): Promise<OrderResponse | null> {
    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

    const orderData: OrderInsert = {
      items,
      total_price: totalPrice,
      order_type: orderType,
      payment_method: paymentMethod
    };

    const { data, error } = await this.supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la sauvegarde de la commande :', error);
      throw error;
    }

    return data as OrderResponse;
  }

  async getOrders(): Promise<OrderResponse[]> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des commandes :', error);
      throw error;
    }

    return data as OrderResponse[];
  }

  async getOrderByNumber(orderNumber: string): Promise<OrderResponse | null> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .maybeSingle();

    if (error) {
      console.error('Erreur lors de la récupération de la commande :', error);
      throw error;
    }

    return data as OrderResponse | null;
  }

  async getOrderById(orderId: string): Promise<OrderResponse | null> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();

    if (error) {
      console.error('Erreur lors de la récupération de la commande :', error);
      throw error;
    }

    return data as OrderResponse | null;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    const updateData: { status: string; completed_at?: string } = { status };

    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    const { error } = await this.supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (error) {
      console.error('Erreur lors de la mise à jour du statut :', error);
      throw error;
    }
  }
}
