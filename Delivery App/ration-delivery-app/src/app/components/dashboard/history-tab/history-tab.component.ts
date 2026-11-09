import { Component, OnInit } from '@angular/core';
import { DeliveryService } from '../../../services/delivery.service';
import { AuthService } from '../../../services/auth';

@Component({
  standalone: false,
  selector: 'app-history-tab',
  templateUrl: './history-tab.component.html',
  styleUrls: ['./history-tab.component.css']
})
export class HistoryTabComponent implements OnInit {
  deliveries: any[] = [];

  constructor(
    private deliveryService: DeliveryService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    // const deliveryManId = this.auth.loggedInUserId;
    const deliveryManId = JSON.parse(localStorage.getItem('user') || '{}')?.id;
    if (!deliveryManId) {
      console.log("ID not found")
      return
    };

    this.deliveryService.getDeliveriesByDeliveryMan(deliveryManId).subscribe({
      next: (data) => {
        this.deliveries =  data.deliveries;
      },
      error: (err) => console.error('Failed to load history', err)
    });
  }

  filteredDeliveries(): any[] {
    return this.deliveries.filter((d: any) =>
      d.status?.toString().toUpperCase().trim() === 'DELIVERED'
    );
  }
}
