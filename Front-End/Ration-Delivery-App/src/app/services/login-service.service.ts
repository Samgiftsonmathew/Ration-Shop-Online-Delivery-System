import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  private baseUrl = 'http://192.168.18.49:8080/users'; // change if needed

  constructor(private http: HttpClient) {}


  getUserBySmartCard(smartCardNo: string): Observable<any> {
  return this.http.get(`${this.baseUrl}/smartcard/${smartCardNo}`);
}
// getUserByEmail(email: string): Observable<any> {
//   return this.http.get(`${this.baseUrl}/email/${email}`);
// }
sendOtp(email: string, role: string) {
  const params = { email, role };
  return this.http.post('http://192.168.18.49:8080/auth/send-otp', null, { params });
}
  verifyOtp(email: string, otp: string, role: string) {
    const params = new HttpParams()
      .set('email', email)
      .set('otp', otp)
      .set('role', role);

    return this.http.post('http://192.168.18.49:8080/auth/verify-otp', null, { params });
  }

 
}
