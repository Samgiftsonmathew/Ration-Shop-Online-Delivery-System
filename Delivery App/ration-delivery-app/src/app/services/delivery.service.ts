import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Delivery {
  orderId: number;
  status: string;
  regionId: number;
  customerName: string;
  address: string;
  phNo: number;
}

export interface DeliveryByDeliveryManResponse {
  deliveryMan: {
    id: number;
  };
  deliveries: Delivery[];
}



@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private baseUrl = 'http://192.168.18.49:8080';

  constructor(private http: HttpClient) {}

getDeliveryById(orderId: number): Observable<Delivery> {
  return this.http.get<Delivery>(`${this.baseUrl}/delivery/${orderId}`);
}

updateOrderStatus(orderId: number): Observable<any> {
  return this.http.put(`${this.baseUrl}/orders/updatestatus/${orderId}?status=DELIVERED`, null);
}

  getDeliveriesByDeliveryMan(deliveryManId: number): Observable<DeliveryByDeliveryManResponse> {
    return this.http.get<DeliveryByDeliveryManResponse>(`${this.baseUrl}/delivery/bydeliveryman/${deliveryManId}`);
  }

}
