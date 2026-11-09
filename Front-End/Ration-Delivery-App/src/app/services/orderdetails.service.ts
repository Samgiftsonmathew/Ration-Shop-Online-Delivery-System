

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../class/order';

@Injectable({
  providedIn: 'root',
})
export class OrderdetailsService {
  private baseUrl = 'http://192.168.18.49:8080/orders';

  constructor(private http: HttpClient) {}

  getOrdersByCustomerId(customerId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/${customerId}`);
  }

  cancelOrder(orderId: number) {
    const url = `${this.baseUrl}/updatestatus/${orderId}?status=CANCELLED`;
    return this.http.put(url, null); // Put with no body
  }
}