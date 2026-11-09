import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer, Order, Region } from './customer.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiUrl = 'http://192.168.18.49:8080/users/role/USER';
  private baseUrl = 'http://192.168.18.49:8080/users';
  private orderUrl = 'http://192.168.18.49:8080/orders';
  private regionUrl = 'http://192.168.18.49:8080/regions';
  private cardTypeUrl = 'http://192.168.18.49:8080/enums/card-types';

  private customerList = new BehaviorSubject<Customer[]>([]);
  customerList$ = this.customerList.asObservable();

  constructor(private http: HttpClient) {}

  // ✅ Get all customers
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  refreshCustomers(): void {
    this.getCustomers().subscribe((data) => this.customerList.next(data));
  }

  // ✅ Get a customer by ID
  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/${id}`);
  }

  // ✅ Create a new customer
  addCustomer(customer: any): Observable<Customer> {
    return this.http.post<Customer>(this.baseUrl, customer);
  }

  // ✅ Update existing customer
  updateCustomer(id: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseUrl}/${id}`, customer);
  }

  // ✅ Delete a customer
  /* deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  } */

  // ✅ Get region list
  getRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(this.regionUrl);
  }

  // ✅ Get card type enums
  getCardTypes(): Observable<string[]> {
    return this.http.get<string[]>(this.cardTypeUrl);
  }

  // ✅ Get orders by customer ID
  getOrdersByCustomerId(customerId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.orderUrl}/${customerId}`);
  }
}
