import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html'
})
export class OrderDetailsComponent implements OnInit {
  orderId: number = 0;
  order: any = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    console.log(this.orderId)
    // Dummy static data - replace with backend call if needed
    this.order = {
      id: this.orderId,
      name: 'Order #' + this.orderId,
      address: '123 Sample Street',
      status: 'Dispatched'
    };
  }

  markAsDelivered(): void {
    this.order.status = 'Delivered';
    alert('Order marked as delivered.');
  }
}
