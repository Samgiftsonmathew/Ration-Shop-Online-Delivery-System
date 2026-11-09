import { Component, OnInit } from '@angular/core';
import { DeliveryService } from '../../../services/delivery.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { Delivery } from '../../../services/delivery.service';

@Component({
  standalone: false,
  selector: 'app-orders-tab',
  templateUrl: './orders-tab.component.html',
  styleUrls: ['./orders-tab.component.css']
})
export class OrdersTabComponent implements OnInit {
  deliveries: Delivery[] = [];

  constructor(
    private deliveryService: DeliveryService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // const deliveryManId = this.auth.loggedInUserId;
     const deliveryManId  = JSON.parse(localStorage.getItem('user') || '{}')?.id
    if (!deliveryManId) {
      console.error('🚫 Delivery man ID not found');
      return;
    }

    this.loadDeliveries(deliveryManId);
  }

  loadDeliveries(deliveryManId: number): void {
    this.deliveryService.getDeliveriesByDeliveryMan(deliveryManId).subscribe({
      next: (data) => {
        console.log('📦 Deliveries received from API:', data);
        this.deliveries = data.deliveries;
      },
      error: (err) => console.error('❌ Failed to fetch deliveries', err)
    });
  }

  filteredDeliveriesbyDispatch(): any[] {
    return this.deliveries.filter((d: any) =>
      d.status?.toString().toUpperCase().trim() === 'DISPATCHED'
    );
  }

   markAsDelivered(delivery: any): void {
    this.deliveryService.updateOrderStatus(delivery.orderId).subscribe({
      next: () => {
        alert(`✅ Order ${delivery.orderId} marked as delivered.`);
        delivery.status = 'DELIVERED'; // update locally
      },
      error: (err) => {
        console.error('Failed to update delivery status', err);
        alert('Failed to mark as delivered.');
      }
    });

  }
}
