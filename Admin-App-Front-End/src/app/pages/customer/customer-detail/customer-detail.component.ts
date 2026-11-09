import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../customer.service';
import { Customer, Order, Region } from '../customer.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css'],
})
export class CustomerDetailComponent implements OnInit {
  customer!: Customer;
  orders: Order[] = [];
  regions: Region[] = [];

  constructor(
    private route: ActivatedRoute,
    private service: CustomerService
  ) {}

  ngOnInit(): void {
    const customerId = Number(this.route.snapshot.paramMap.get('id'));

    this.service.getCustomerById(customerId).subscribe({
      next: (data) => {
        this.customer = data;
        this.loadOrders(customerId);
        this.loadRegions();
      },
      error: (err) => console.error('❌ Failed to load customer:', err),
    });
  }

  loadOrders(customerId: number): void {
    this.service.getOrdersByCustomerId(customerId).subscribe({
      next: (orders) => (this.orders = orders),
      error: (err) => console.error('❌ Failed to load orders:', err),
    });
  }

  loadRegions(): void {
    this.service.getRegions().subscribe({
      next: (data) => (this.regions = data),
      error: (err) => console.error('❌ Failed to load regions:', err),
    });
  }

  getRegionName(regionId: number): string {
    const region = this.regions.find((r) => r.id === regionId);
    return region ? region.name : 'N/A';
  }
}
