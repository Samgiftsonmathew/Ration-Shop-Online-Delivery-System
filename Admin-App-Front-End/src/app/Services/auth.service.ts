import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInKey = 'isLoggedIn';
  private logoutTimeKey = 'logoutAt';
  private logoutTimer: any;

  constructor(private router: Router) {
    this.checkSessionTimeout();
  }

  login() {
    localStorage.setItem(this.loggedInKey, 'true');

    // Set logout timestamp for 10 minutes from now
    const logoutAt = Date.now() + 100 * 60 * 1000; // 10 minutes
    localStorage.setItem(this.logoutTimeKey, logoutAt.toString());

    this.setAutoLogout(logoutAt - Date.now());
  }

  logout() {
    localStorage.removeItem(this.loggedInKey);  
    localStorage.removeItem(this.logoutTimeKey);
    clearTimeout(this.logoutTimer);
    this.router.navigate(['/login']);
    window.dispatchEvent(new Event('sessionExpired'));
  }

  logoutbtn() {
    localStorage.removeItem(this.loggedInKey);  
    localStorage.removeItem(this.logoutTimeKey);
    clearTimeout(this.logoutTimer);
    this.router.navigate(['/login']);
    // window.dispatchEvent(new Event('sessionExpired'));
  }

  isLoggedIn(): boolean {
    const isLogged = localStorage.getItem(this.loggedInKey) === 'true';
    const logoutAt = parseInt(localStorage.getItem(this.logoutTimeKey) || '0', 10);

    if (!isLogged || Date.now() > logoutAt) {
      this.logout(); // Auto logout if expired
      return false;
    }

    return true;
  }

  private setAutoLogout(duration: number) {
    clearTimeout(this.logoutTimer); // Clear any existing timer
    this.logoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  private checkSessionTimeout() {
    const logoutAt = parseInt(localStorage.getItem(this.logoutTimeKey) || '0', 10);
    const remainingTime = logoutAt - Date.now();

    if (logoutAt && remainingTime > 0) {
      this.setAutoLogout(remainingTime);
    } else if (logoutAt) {
      this.logout(); // Already expired
    }
  }
}
























// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private loggedInKey = 'isLoggedIn';

//   login() {
//     localStorage.setItem(this.loggedInKey, 'true');
//   }

//   logout() {
//     localStorage.removeItem(this.loggedInKey);
//   }

//   isLoggedIn(): boolean {
//     return localStorage.getItem(this.loggedInKey) === 'true';
//   }
// }
