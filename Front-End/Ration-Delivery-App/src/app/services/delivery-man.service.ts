import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeliveryMan ,DeliveryOrder} from '../class/delivery-man';

@Injectable({
  providedIn: 'root'
})
export class DeliveryManService {
  private baseUrl = 'http://192.168.18.49:8080/deliverymen';

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<DeliveryMan> {
    return this.http.get<DeliveryMan>(`${this.baseUrl}/find/${id}`);
  }

  getByRegion(regionId: number): Observable<DeliveryMan[]> {
    return this.http.get<DeliveryMan[]>(`${this.baseUrl}/region/${regionId}`);
  }

  add(deliveryMan: DeliveryMan): Observable<DeliveryMan> {
  return this.http.post<DeliveryMan>(`${this.baseUrl}/add`, deliveryMan);
}

  update(id: number, deliveryMan: DeliveryMan): Observable<DeliveryMan> {
    return this.http.put<DeliveryMan>(`${this.baseUrl}/update/${id}`, deliveryMan);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
  getDeliveriesByManId(id: number): Observable<{ deliveries: DeliveryOrder[] }> {
         return this.http.get<{ deliveries: DeliveryOrder[] }>(`http://192.168.18.49:8080/delivery/bydeliveryman/${id}`);
}

}


interface DeliveryResponse {
  deliveryMan: {
    id: number;
  };
  deliveries: DeliveryOrder[];
}
