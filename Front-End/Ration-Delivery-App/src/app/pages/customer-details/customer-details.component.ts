import { Component, OnInit } from '@angular/core';
import { User } from '../../class/user';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { OrderdetailsService } from '../../services/orderdetails.service';
import { Order } from '../../class/order';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css'
})
export class CustomerDetailsComponent implements OnInit {
customerId!: number;
  customer?: User;
  isLoading = true;
  errorMessage = '';
  
  selectedMonth: string = '';
  selectedItems: any[] = [];
  groupedOrders: {
    month: string;
    orders: {
      orderId: number;
      items: any[];
      status: string;
      deliveryDate: string;
    }[];
  }[] = [];
  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private orderService: OrderdetailsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.customerId = +idParam;
        this.fetchCustomerDetails(this.customerId);
         
        this.orderService.getOrdersByCustomerId(this.customerId).subscribe({
            next: (orders: Order[]) => {
              const groupedMap = new Map<string, Order[]>();
              orders.forEach(order => {
                const month = this.formatMonth(order.createdAt);
                if (!groupedMap.has(month)) groupedMap.set(month, []);
                groupedMap.get(month)!.push(order);
              });
    
              // Convert to array with combined items
              
            //   this.groupedOrders = Array.from(groupedMap.entries()).map(([month, orders]) => {
            //     const allItems = orders.flatMap(o => o.items);
            //     const deliveryDate = orders[0].deliveryDate;
            //     const status = orders[0].status;
            //     return { month, orders, items: allItems, status, deliveryDate };
            //   });
            // },
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
            error: err => console.error('Error fetching orders', err)
          });
      }

      
    });
  
  }


  fetchCustomerDetails(id: number): void {
    this.isLoading = true;
    this.customerService.getCustomerById(id).subscribe({
      next: (data: User) => {
        this.customer = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error loading customer details.';
        console.error(err);
        this.isLoading = false;
      }

      
    });
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
      year: 'numeric'
    });
  }

  openModal(month: string, items: any[]) {
    this.selectedMonth = month;
    this.selectedItems = items;
  }
}

