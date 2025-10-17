import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SupabaseApiService } from '../../services/supabase-api.service';
import { PricePipe } from '../../pipes/price.pipe';

interface OrderReceipt {
  id: string;
  order_number: string;
  items: any[];
  total_price: number;
  order_type: string;
  payment_method: string;
  created_at: string;
}

@Component({
  selector: 'app-validation-page',
  imports: [CommonModule, PricePipe],
  templateUrl: './validation-page.component.html',
  styleUrl: './validation-page.component.css'
})
export class ValidationPageComponent implements OnInit {
  order: OrderReceipt | null = null;
  isLoading = true;
  currentDate = new Date();

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly supabaseService: SupabaseApiService
  ) {}

  async ngOnInit(): Promise<void> {
    const orderId = this.route.snapshot.queryParams['orderId'];
    const orderNumber = this.route.snapshot.queryParams['orderNumber'];

    if (!orderId || !orderNumber) {
      this.router.navigate(['/home']);
      return;
    }

    try {
      const orderData = await this.supabaseService.getOrderById(orderId);
      if (orderData) {
        this.order = orderData as OrderReceipt;
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la commande:', error);
    } finally {
      this.isLoading = false;
    }
  }

  printReceipt(): void {
    window.print();
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  getOrderTypeLabel(type: string): string {
    return type === 'emporter' ? 'À emporter' : 'Sur place';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}
