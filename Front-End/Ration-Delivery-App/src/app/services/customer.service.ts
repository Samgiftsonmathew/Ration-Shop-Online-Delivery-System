import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../class/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
   private baseUrl = "http://192.168.18.49:8080/users"; // Update to your actual backend endpoint
   

  constructor(private http: HttpClient) {}

  getAllCustomers(id:number): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/region/${id}`);
  }

  getCustomerById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }
}
