

import { Component, OnInit } from '@angular/core';
import { SubadminService } from '../../services/subadmin.service';

@Component({
  selector: 'app-subadmin-order-items',
  templateUrl: './subadmin-order-items.component.html',
  styleUrl: './subadmin-order-items.component.css',
})
export class SubadminOrderItemsComponent implements OnInit {
  orders: any[] = [];
  deliveryMen: any[] = [];
  selectedOrder: any = null;
  selectedDeliveryManId: number | null = null;

  subadminId = 0;
  regionId = 0;
  userId = 0;

  fetchedOrderItems: any[] = [];

  constructor(private subadminService: SubadminService) {}

  ngOnInit(): void {
    const userDataRaw = localStorage.getItem('user'); // or whatever key you're using
    const userData = userDataRaw ? JSON.parse(userDataRaw) : null;

    if (!userData || !userData.id || !userData.regionId) {
      console.error('Missing or invalid user data in localStorage');
      return;
    }

    this.subadminId = userData.id;
    this.regionId = userData.regionId;
    this.userId =  0; 

    console.log('✅ Subadmin:', this.subadminId);
    console.log('✅ Region:', this.regionId);


    this.loadOrders();
    this.loadDeliveryMen();
  }

  loadOrders(): void {
    this.subadminService.getOrdersBySubadmin(this.subadminId).subscribe({
      next: (data) => (this.orders = data),
      error: (err) => console.error('❌ Failed to load orders:', err),
    });
  }

  viewOrderDetails(order: any): void {
    const itemsArray = Array.isArray(order.items)
      ? order.items
      : Object.values(order.items || {});

    this.selectedOrder = {
      ...order,
      items: itemsArray,
    };

    console.log('🛒 selectedOrder set:', this.selectedOrder);
  }

  loadDeliveryMen(): void {
    this.subadminService.getDeliveryMenByRegion(this.regionId).subscribe({
      next: (data) => (this.deliveryMen = data),
      error: (err) => console.error('❌ Failed to load delivery men:', err),
    });
  }

  openAssignModal(order: any): void {
    this.selectedOrder = order;
    this.selectedDeliveryManId = null;
    this.userId = order.customerId;

    console.log('👤 Customer ID assigned to userId:', this.userId);
  }

  isAssigning: boolean = false;
 assignDeliveryMan(): void {
  if (!this.selectedOrder || !this.selectedDeliveryManId) return;
  this.isAssigning = true; 
  const payload = {
    deliveryMan: { id: this.selectedDeliveryManId },
    orderId: this.selectedOrder.id,
    regionId: this.regionId,
    status: 'DISPATCHED',
    user: { id: this.selectedOrder.customerId },
  };

  this.subadminService.assignOrderToDeliveryMan(payload).subscribe({
    next: () => {
      console.log('Order assigned. Now updating status...');

      // Call updateOrderStatus API
      this.subadminService
        .updateOrderStatus(this.selectedOrder.id, 'DISPATCHED')
        .subscribe({
          next: () => {
            console.log(' Status updated to DISPATCHED');
            this.loadOrders(); // Refresh list from backend
            this.selectedOrder = null;
            this.selectedDeliveryManId = null;
            this.isAssigning = false;
          },
          error: (err) =>{
            console.error('Failed to update order status:', err),
          this.isAssigning = false;
        }
            
        });
    },
      error: (err) => {
      console.error('Failed to assign order:', err);
      this.isAssigning = false;
    },
  });
}


  // For searching orders
  searchTerm: string = '';
  get filteredOrders() {
    if (!this.searchTerm.trim()) return this.orders;

    const term = this.searchTerm.toLowerCase();
    return this.orders.filter(
      (order) =>
        order.id.toString().includes(term) ||
        (order.status?.toLowerCase().includes(term) ?? false)
    );
  }

  //  New method to fetch order data by card click
  onOrderCardClick(orderId: number): void {
    this.subadminService.getOrderById(orderId).subscribe({
      next: (orderData) => {
        console.log('Fetched Full Order:', orderData);

        this.userId = orderData.customerId;
        this.fetchedOrderItems = orderData.items;

        console.log('👤 Set userId from order:', this.userId);
        console.log('Order Items:', this.fetchedOrderItems);

        // Optional: open a modal or highlight the order card
      },
      error: (err) => console.error('Failed to fetch order by ID:', err),
    });
  }
}