import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseApiService } from '../../services/supabase-api.service';
import { NotificationService } from '../../services/notifications/notification.service';

interface Order {
  id: string;
  order_number: string;
  items: Array<{
    uuid: string;
    title: string;
    price: number;
    imageUrl: string;
  }>;
  total_price: number;
  order_type: string;
  payment_method?: string;
  status: string;
  created_at: string;
  completed_at?: string;
}

@Component({
  selector: 'app-admin-orders-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders-page.component.html',
  styleUrls: ['./admin-orders-page.component.css']
})
export class AdminOrdersPageComponent implements OnInit {
  orders = signal<Order[]>([]);
  filteredOrders = signal<Order[]>([]);
  selectedStatus = signal<string>('all');
  isLoading = signal<boolean>(false);
  expandedOrderId = signal<string | null>(null);

  constructor(
    private readonly _supabaseService: SupabaseApiService,
    private readonly _notificationService: NotificationService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadOrders();
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

  async updateOrderStatus(orderId: string, newStatus: string): Promise<void> {
    try {
      await this._supabaseService.updateOrderStatus(orderId, newStatus);
      this._notificationService.success(`Commande mise à jour : ${newStatus}`);
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
      case 'completed':
        return 'status-completed';
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
      case 'completed':
        return 'Terminée';
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
