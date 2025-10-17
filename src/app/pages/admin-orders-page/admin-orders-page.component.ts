import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SupabaseApiService } from '../../services/supabase-api.service';
import { NotificationService } from '../../services/notifications/notification.service';
import { PricePipe } from '../../pipes/price.pipe';

interface OrderItem {
  uuid: string;
  title: string;
  price: number;
  imageUrl: string;
  validated?: boolean;
}

interface Order {
  id: string;
  order_number: string;
  items: OrderItem[];
  total_price: number;
  order_type: string;
  payment_method?: string;
  status: string;
  created_at: string;
  completed_at?: string;
}

@Component({
  selector: 'app-admin-orders-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PricePipe],
  templateUrl: './admin-orders-page.component.html',
  styleUrls: ['./admin-orders-page.component.css']
})
export class AdminOrdersPageComponent implements OnInit, OnDestroy {
  orders = signal<Order[]>([]);
  filteredOrders = signal<Order[]>([]);
  selectedStatus = signal<string>('all');
  isLoading = signal<boolean>(false);
  expandedOrderId = signal<string | null>(null);
  newOrderIds = signal<Set<string>>(new Set());
  itemValidationState = signal<Map<string, Set<number>>>(new Map());

  private realtimeSubscription?: Subscription;
  private notificationAudio?: HTMLAudioElement;

  constructor(
    private readonly _supabaseService: SupabaseApiService,
    private readonly _notificationService: NotificationService
  ) {
    this.notificationAudio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwNUrDn77ljHQU1mdXyy3krBSh+zPLaizsIGGS66+qhThELTKXh8bllHAUuhc/y1YU2Bhxru+7mnEwNC1Ct5O+2Yh0FNZrV8st5KwUofsvx2Ys7Bxlku+vtoU4RC0yl4fG5ZRwFL4XP8tWFNgYca7vu5pxMDQtQreTvtmIdBTWa1fLLeSsFKH7L8dmLOwcZZLvr7aFOEQtMpeHxuWUcBS+Fz/LVhTYGHGu77uacTA0LUK3k77ZiHQU1mtXyy3krBSh+y/HZizsHGWS76+2hThELTKXh8bllHAUvhc/y1YU2Bhxru+7mnEwNC1Ct5O+2Yh0FNZrV8st5KwUofsvx2Ys7Bxlku+vtoU4RC0yl4fG5ZRwFL4XP8tWFNgYca7vu5pxMDQtQreTvtmIdBTWa1fLLeSsFKH7L8dmLOwcZZLvr7aFOEQtMpeHxuWUcBS+Fz/LVhTYGHGu77uacTA0LUK3k77ZiHQU1mtXyy3krBSh+y/HZizsHGWS76+2hThELTKXh8bllHAUvhc/y1YU2Bhxru+7mnEwNC1Ct5O+2Yh0FNZrV8st5KwUofsvx2Ys7Bxlku+vtoU4RC0yl4fG5ZRwFL4XP8tWFNgYca7vu5pxMDQtQreTvtmIdBTWa1fLLeSsFKH7L8dmLOwcZZLvr7aFOEQtMpeHxuWUcBS+Fz/LVhTYGHGu77uacTA0LUK3k77ZiHQU1mtXyy3krBSh+y/HZizsHGWS76+2hThELTKXh8bllHAUvhc/y1YU2Bhxru+7mnEwNC1Ct5O+2Yh0FNZrV8st5KwUofsvx2Ys7Bxlku+vtoU4RC0yl4fG5ZRwFL4XP8tWFNgYca7vu5pxMDQtQreTvtmIdBTWa1fLLeSsFKH7L8dmLOwcZZLvr7aFOEQtMpeHxuWUcBS+Fz/LVhTYGHGu77uacTA0LUK3k77ZiHQU1mtXyy3krBSh+y/HZizsHGWS76+2hThELTKXh8bllHAUvhc/y1YU2Bhxru+7mnEwNC1Ct5O+2Yh0FNZrV8st5KwUofsvx2Ys7Bxlku+vtoU4RC0yl4fG5ZRwFL4XP8tWFNgYca7vu5pxMDQtQreTvtmIdBTWa1fLLeSsFKH7L8dmLOwcZZLvr7aFOEQtMpeHxuWUcBS+Fz/LVhTYGHGu77uacTA0LUK3k77ZiHQU1mtXyy3krBSh+y/HZizsHGWS76+2hThELTKXh8bllHAUvhc/y1YU2Bhxru+7mnEwNC1Ct5O+2Yh0FNZrV8st5KwUofsvx2Ys7Bxlku+vtoU4RC0yl4fG5ZRwFL4XP8tWFNgYca7vu5pxMDQtQreTvtmId');
  }

  async ngOnInit(): Promise<void> {
    await this.loadOrders();
    this.setupRealtimeSubscription();
  }

  ngOnDestroy(): void {
    if (this.realtimeSubscription) {
      this.realtimeSubscription.unsubscribe();
    }
    this._supabaseService.unsubscribeFromOrders();
  }

  private setupRealtimeSubscription(): void {
    this.realtimeSubscription = this._supabaseService.subscribeToOrders().subscribe(event => {
      if (event.eventType === 'INSERT' && event.new) {
        this.handleNewOrder(event.new as Order);
      } else if (event.eventType === 'UPDATE' && event.new) {
        this.handleOrderUpdate(event.new as Order);
      } else if (event.eventType === 'DELETE' && event.old) {
        this.handleOrderDelete(event.old as Order);
      }
    });
  }

  private handleNewOrder(newOrder: Order): void {
    const currentOrders = this.orders();
    this.orders.set([newOrder, ...currentOrders]);
    this.applyFilter();

    const currentNewIds = this.newOrderIds();
    currentNewIds.add(newOrder.id);
    this.newOrderIds.set(new Set(currentNewIds));

    this.playNotificationSound();
    this._notificationService.success(`Nouvelle commande : ${newOrder.order_number}`);

    setTimeout(() => {
      const ids = this.newOrderIds();
      ids.delete(newOrder.id);
      this.newOrderIds.set(new Set(ids));
    }, 5000);
  }

  private handleOrderUpdate(updatedOrder: Order): void {
    const currentOrders = this.orders();
    const index = currentOrders.findIndex(o => o.id === updatedOrder.id);

    if (index !== -1) {
      const updated = [...currentOrders];
      updated[index] = updatedOrder;
      this.orders.set(updated);
      this.applyFilter();
    }
  }

  private handleOrderDelete(deletedOrder: Order): void {
    const currentOrders = this.orders();
    this.orders.set(currentOrders.filter(o => o.id !== deletedOrder.id));
    this.applyFilter();
  }

  private playNotificationSound(): void {
    if (this.notificationAudio) {
      this.notificationAudio.play().catch(err => {
        console.log('Impossible de jouer le son:', err);
      });
    }
  }

  isNewOrder(orderId: string): boolean {
    return this.newOrderIds().has(orderId);
  }

  async loadOrders(): Promise<void> {
    this.isLoading.set(true);
    try {
      const data = await this._supabaseService.getOrders();
      this.orders.set(data);
      this.applyFilter();
      this._notificationService.success(`${data.length} commandes chargées`);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes :', error);
      this._notificationService.error('Erreur lors du chargement des commandes');
    } finally {
      this.isLoading.set(false);
    }
  }

  applyFilter(): void {
    const status = this.selectedStatus();
    const allOrders = this.orders();

    if (status === 'all') {
      this.filteredOrders.set(allOrders);
    } else {
      this.filteredOrders.set(allOrders.filter(order => order.status === status));
    }
  }

  onStatusFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedStatus.set(target.value);
    this.applyFilter();
  }

  toggleOrderDetails(orderId: string): void {
    if (this.expandedOrderId() === orderId) {
      this.expandedOrderId.set(null);
    } else {
      this.expandedOrderId.set(orderId);
    }
  }

  toggleItemValidation(orderId: string, itemIndex: number): void {
    const currentState = this.itemValidationState();
    const newState = new Map(currentState);

    if (!newState.has(orderId)) {
      newState.set(orderId, new Set());
    }

    const orderItems = newState.get(orderId)!;
    if (orderItems.has(itemIndex)) {
      orderItems.delete(itemIndex);
    } else {
      orderItems.add(itemIndex);
    }

    this.itemValidationState.set(newState);
  }

  isItemValidated(orderId: string, itemIndex: number): boolean {
    const state = this.itemValidationState();
    return state.get(orderId)?.has(itemIndex) || false;
  }

  canValidateOrder(orderId: string): boolean {
    const order = this.filteredOrders().find(o => o.id === orderId);
    if (!order) return false;

    const validatedItems = this.itemValidationState().get(orderId);
    return validatedItems?.size === order.items.length;
  }

  async validateOrder(order: Order): Promise<void> {
    if (!this.canValidateOrder(order.id)) {
      this._notificationService.warning('Veuillez cocher tous les articles avant de valider');
      return;
    }

    try {
      await this._supabaseService.updateOrderStatus(order.id, 'validated');
      this._notificationService.success(`Commande ${order.order_number} validée ✅`);

      const currentState = this.itemValidationState();
      const newState = new Map(currentState);
      newState.delete(order.id);
      this.itemValidationState.set(newState);

      await this.loadOrders();
    } catch (error) {
      console.error('Erreur lors de la validation :', error);
      this._notificationService.error('Erreur lors de la validation');
    }
  }

  async updateOrderStatus(orderId: string, newStatus: string): Promise<void> {
    try {
      await this._supabaseService.updateOrderStatus(orderId, newStatus);
      this._notificationService.success(`Commande mise à jour : ${this.getStatusLabel(newStatus)}`);
      await this.loadOrders();
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error);
      this._notificationService.error('Erreur lors de la mise à jour');
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'validated':
        return 'status-validated';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'validated':
        return 'Validée';
      case 'delivered':
        return 'Livrée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
