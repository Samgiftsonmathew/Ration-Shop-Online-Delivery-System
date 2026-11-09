import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, DeliveryMan } from '../../services/auth';

@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  activeTab: 'orders' | 'history' = 'orders';
  user?: DeliveryMan;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    this.user = this.auth.getUser();
  }

  setTab(tab: 'orders' | 'history') {
    this.activeTab = tab;
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
