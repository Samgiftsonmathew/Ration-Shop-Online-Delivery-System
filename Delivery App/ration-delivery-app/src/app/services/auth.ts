import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

/** ✅ DeliveryMan Interface */
export interface DeliveryMan {
  id: number;
  aadharNum: number;
  name: string;
  phoneNO: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiURL = 'http://192.168.18.49:8080/deliverymen/auth';
  private loggedInUser?: DeliveryMan;
  loggedInUserId: number | undefined;

  constructor(private http: HttpClient) {}

  /** ✅ Authenticate Aadhaar + OTP */
  authenticate(userId: string, otp: string): Observable<DeliveryMan | null> {
    const aadhaar = Number(userId);

    if (!aadhaar || otp !== '123456') {
      return of(null); // Invalid inputs
    }

    return this.http.get<DeliveryMan>(`${this.apiURL}/${aadhaar}`).pipe(
      catchError(() => of(null)) // Return null if backend fails
    );
  }

 setUser(user: DeliveryMan) {
  this.loggedInUser = user;
  localStorage.setItem('user', JSON.stringify(user));
}


 getUser(): DeliveryMan | undefined {
  if (!this.loggedInUser) {
    const saved = localStorage.getItem('user');
    if (saved) {
      this.loggedInUser = JSON.parse(saved);
    }
  }
  return this.loggedInUser;
}
logout() {
  this.loggedInUser = undefined;
  localStorage.removeItem('user');
}

}
