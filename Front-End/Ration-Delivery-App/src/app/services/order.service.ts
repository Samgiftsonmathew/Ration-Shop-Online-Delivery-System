import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orderUrl = 'http://192.168.18.49:8080/orders';

  constructor(private http: HttpClient) {}

  // Place a new order
  placeOrder(orderPayload: any): Observable<any> {
    const url = `${this.orderUrl}/placeorder`;
    return this.http.post<any>(url, orderPayload);
  }

  // Get order details by order ID
  getOrderById(orderId: number): Observable<any> {
    const url = `${this.orderUrl}/${orderId}`;
    return this.http.get<any>(url);
  }
}
