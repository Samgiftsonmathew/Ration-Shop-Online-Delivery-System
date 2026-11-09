


// subadmin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubadminService {
  private baseUrl = 'http://192.168.18.49:8080';

  constructor(private http: HttpClient) {}

  getOrderById(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/orders/${orderId}`);
  }

  updateOrderStatus(orderId: number, newStatus: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/orders/updatestatus/${orderId}?status=DISPATCHED`,
      {}
    );
  }

  getOrdersBySubadmin(subadminId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/orders/subadminorders/${subadminId}`
    );
  }

  getDeliveryMenByRegion(regionId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/deliverymen/region/${regionId}`
    );
  }

  assignOrderToDeliveryMan(payload: {
    deliveryMan:{id: number};
    orderId: number;
    regionId: number;
    status: string;
    user: {id:number};
  }): Observable<any> {
    const url = `${this.baseUrl}/delivery/save`;
    return this.http.post(url, payload);
  }
}