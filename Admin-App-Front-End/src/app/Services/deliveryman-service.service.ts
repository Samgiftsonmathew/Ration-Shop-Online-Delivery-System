import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeliveryMan } from '../pages/delivery-man/delivery-man.model';
import { Region } from '../models/region.model';

@Injectable({
  providedIn: 'root'
})
export class DeliveryManService {
  deleteDeliveryMan(id: number): Observable<any> {
  return this.http.delete(`http://192.168.18.49:8080/deliverymen/delete/${id}`);
}

 

  private baseUrl = 'http://192.168.18.49:8080/deliverymen';

  constructor(private http: HttpClient) {}

  getRegions(): Observable<Region[]> {
  return this.http.get<Region[]>(`http://192.168.18.49:8080/regions`);
    }

  getAllDeliveryMen(): Observable<DeliveryMan[]> {
    return this.http.get<DeliveryMan[]>(`${this.baseUrl}`);
  }
  addDeliveryMan(deliveryMan: DeliveryMan): Observable<DeliveryMan> {
  return this.http.post<DeliveryMan>(`${this.baseUrl}/add`, deliveryMan);
}

updateDeliveryMan(deliveryMan: DeliveryMan): Observable<DeliveryMan> {
  return this.http.put<DeliveryMan>(`${this.baseUrl}/update/${deliveryMan.id}`, deliveryMan);
}

getDeliveryManById(id: number): Observable<DeliveryMan> {
  return this.http.get<DeliveryMan>(`${this.baseUrl}/${id}`);
}

getDeliveryManByRegion(regionId: number): Observable<DeliveryMan[]> {
  return this.http.get<DeliveryMan[]>(`${this.baseUrl}/region/${regionId}`);
}


}
