import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginServicesService {

  private baseUrl = 'http://192.168.18.49:8080/auth';

  constructor(private http: HttpClient) {}

  sendOtp(email: string): Observable<any> {
    const params = new HttpParams()
      .set('email', email)
      .set('role', 'ADMIN');
    return this.http.post(`${this.baseUrl}/send-otp`, null, { params });
  }

  verifyOtp(email: string, otp: string): Observable<any> {
    const params = new HttpParams()
      .set('email', email)
      .set('otp', otp);
    return this.http.post(`${this.baseUrl}/verify-otp`, null, { params });
  }
}
