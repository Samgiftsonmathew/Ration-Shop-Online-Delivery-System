

import { Component, OnInit } from '@angular/core';
import { Order } from '../../class/order';
import { OrderdetailsService } from '../../services/orderdetails.service';

@Component({
  selector: 'app-customer-orderhistory',
  templateUrl: './customer-orderhistory.component.html',
  styleUrls: ['./customer-orderhistory.component.css'],
})
export class CustomerOrderhistoryComponent implements OnInit {
  groupedOrders: {
    month: string;
    orders: {
      orderId: number;
      items: any[];
      status: string;
      deliveryDate: string;
    }[];
  }[] = [];
  selectedMonth: string = '';
  selectedItems: any[] = [];
  
  constructor(private orderService: OrderdetailsService) {}

  ngOnInit(): void {
    
    const userdetails = localStorage.getItem('user');
    if (userdetails) {
      const parsedUser = JSON.parse(userdetails);
      this.orderService.getOrdersByCustomerId(parsedUser.id).subscribe({
        next: (orders: Order[]) => {
          console.log(orders)
          const groupedMap = new Map<string, Order[]>();

          //group by month
          orders.forEach((order) => {
            const month = this.formatMonth(order.createdAt);
            if (!groupedMap.has(month)) groupedMap.set(month, []);
            groupedMap.get(month)!.push(order);
          });

          // Convert to array with combined items
          this.groupedOrders = Array.from(groupedMap.entries()).map(
            ([month, orders]) => {
              const detailedOrders = orders.map((o) => ({
                orderId: o.id,
                items: o.items,
                status: o.status,
                deliveryDate: o.deliveryDate,
              }));
              return { month, orders: detailedOrders };
            }
          );
        },
        error: (err) => console.error('Error fetching orders', err),
      });
    }
  }

  formatMonth(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); // July 2025
  }

  formatDeliveryDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  openModal(month: string, items: any[]) {
    this.selectedMonth = month;
    this.selectedItems = items;
    console.log(this.selectedItems)
  }

  cancelOrder(orderId: number) {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
          alert('Order cancelled successfully!');

          // Find and update the order in groupedOrders
          for (const group of this.groupedOrders) {
            const order = group.orders.find((o) => o.orderId === orderId);
            if (order) {
              order.status = 'CANCELLED';
              break;
            }
          }
        },
        error: (err) => {
          console.error('Error cancelling order:', err);
          alert('Something went wrong while cancelling.');
        },
      });
    }
  }
}