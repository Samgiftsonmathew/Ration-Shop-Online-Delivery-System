import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../customer.service';
import { Customer } from '../customer.model';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];

  filteredCustomers: Customer[] = [];
  searchTerm: string = '';
  regionIds: number[] = [1, 2, 3, 4];
  selectedRegionId: string = '';
  regions: { id: number; name: string }[] = [
    { id: 1, name: 'Chennai' },
    { id: 2, name: 'Coimbatore' },
    { id: 3, name: 'Madurai' },
    { id: 4, name: 'Trichy' },
  ];
  constructor(private service: CustomerService, private router: Router) {}
  scrollPosition: number = 0;

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers(): void {
    this.service.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.filteredCustomers = data;
      },
      error: (err) => {
        console.error('❌ Failed to load customers:', err);
      },
    });

    setTimeout(() => {
      const scrollY = localStorage.getItem('customerScrollPos');
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY));
        localStorage.removeItem('customerScrollPos');
      }
    }, 100);
  }

  filterByRegion() {
    const regionId = parseInt(this.selectedRegionId);
    if (!this.selectedRegionId) {
      this.filteredCustomers = this.customers;
    } else {
      this.filteredCustomers = this.customers.filter(
        (c) => c.regionId === regionId
      );
    }
  }

  /* deleteCustomer(id: number): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.service.deleteCustomer(id).subscribe({
        next: () => {
          // Option 1: Filter deleted customer from array
          this.customers = this.customers.filter((c) => c.id !== id);
          this.filterCustomers();

          // Option 2: Re-fetch from backend
          // this.getCustomers();

          console.log(`✅ Customer with ID ${id} deleted.`);
        },
        error: (err) => {
          console.error('❌ Failed to delete customer:', err);
        },
      });
    }
  } */

  filterCustomers(): void {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredCustomers = this.customers.filter(
      (customer) =>
        customer.name!.toLowerCase().startsWith(term) ||
        customer.email!.toLowerCase().startsWith(term) ||
        customer.phone!.toString().startsWith(term) ||
        customer.smartcardNo!.toString().startsWith(term)
    );
  }

  viewDetail(id: number): void {
    this.scrollPosition = window.scrollY; // Save current scroll position
    localStorage.setItem('customerScrollPos', this.scrollPosition.toString());
    this.router.navigate(['/customers', id]);
  }

  editCustomer(id: number): void {
    this.router.navigate(['/customers/edit', id]);
  }

  createCustomer(): void {
    this.router.navigate(['/customers/create']);
  }

  getRegionName(id: number): string | undefined {
    return this.regions.find((region) => region.id === id)?.name;
  }
}
