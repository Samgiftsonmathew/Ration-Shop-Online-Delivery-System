import { Component, OnInit } from '@angular/core';
import { User } from '../../class/user';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrl: './customer-info.component.css'
})
export class CustomerInfoComponent implements OnInit {
   
   customers: User[] = [];
  filteredCustomers: User[] = [];
  searchText: string = '';

  constructor(private customerService: CustomerService) {}

ngOnInit(): void {
  const user = localStorage.getItem('user');

  if (user) {
      const parsedUser = JSON.parse(user);
      
      if (parsedUser && parsedUser.regionId) {
        this.loadCustomers(parsedUser.regionId);
      } else {
        console.error('Region ID not found in parsed user object');
      }
  } else {
    console.warn('No user found in localStorage');
  }
}

 loadCustomers(regionId: number): void {
  this.customerService.getAllCustomers(regionId).subscribe({
    next: (data: User[]) => {
      const users = data.filter((user) => user.role === 'USER');
      this.customers = users;
      this.filteredCustomers = users;
    },
    error: (err) => {
      console.error('Error loading customers', err);
    }
  });
  }

  onSearch(): void {
    const keyword = this.searchText.trim().toLowerCase();
    this.filteredCustomers = this.customers.filter(c =>
      (c.name && c.name.toLowerCase().includes(keyword)) ||
      (c.address && c.address.toLowerCase().includes(keyword))
    );
  }

}
