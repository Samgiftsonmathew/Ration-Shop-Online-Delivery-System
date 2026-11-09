  import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../class/product';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private baseUrl = 'http://192.168.18.49:8080';

  private selectedItems: any[] = [];

  constructor(private http: HttpClient) {}

  getAllocationsByCardType(cardType: string,userId:number,regionId:number) {
    const url = `${this.baseUrl}/allocation/allocations/user/${userId}/region/${regionId}/card-type/${cardType}`;
    return this.http.get<Product[]>(url);
  }

  // Place a new order
  placeOrder(orderPayload: any): Observable<any> {
    const url = `${this.baseUrl}/orders/placeorder`;
    return this.http.post<any>(url, orderPayload);
  }

  // Get order details by order ID
  getOrderById(orderId: number): Observable<any> {
    const url = `${this.baseUrl}/orders/${orderId}`;
    return this.http.get<any>(url);
  }

  //navigate the selected items thoughout the pages
  setSelectedItems(items: any[]) {
    this.selectedItems = items;
  }

  getSelectedItems(): any[] {
    return this.selectedItems;
  }

  clearSelectedItems() {
    this.selectedItems = [];
  }
}
