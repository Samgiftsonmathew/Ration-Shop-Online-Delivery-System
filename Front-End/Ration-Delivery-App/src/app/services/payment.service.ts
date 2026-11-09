import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = 'http://192.168.18.49:8080/api/payment';
  constructor(private http: HttpClient) { }
  
  createRazorpayOrder(amount: number, currency: string = 'INR'): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-order?amount=${amount}&currency=${currency}`, {});
  }
  verifyRazorpayPayment(payload: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/verify-payment`, payload);
}
}
