import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(private router: Router, private authService: AuthService) {}

  navigateToCustomer() {
    this.router.navigate(['/customers']);
  }

  navigateToSubAdmin() {
    this.router.navigate(['/subadmin']);
  }

  navigateToProduct() {
    this.router.navigate(['/products']);
  }

  navigateToDelivery() {
    this.router.navigate(['/delivery']);
  }
   logout() {
    this.authService.logoutbtn();
    // this.router.navigate(['/login']);
  }

}
