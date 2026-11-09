// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  userId = '';
  otp = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
  this.auth.authenticate(this.userId, this.otp).subscribe(user => {
    if (user) {
      this.auth.setUser(user); // ✅ Save deliveryman ID
      this.router.navigate(['/dashboard/orders']);
    } else {
      alert('Invalid Aadhaar or OTP');
    }
  });
}
}
