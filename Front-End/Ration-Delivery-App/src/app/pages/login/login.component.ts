import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginServiceService } from '../../services/login-service.service';
import { OtpVerifyRequest } from '../../class/login';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'

})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isOwner: boolean = true;
  showOtpField = false;
  otp: string = '';
 isLoading = false;
 userobject:any;
  constructor(private fb: FormBuilder,
    private loginService: LoginServiceService ,

    private router: Router
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }
  buildForm(): void {
    this.loginForm = this.fb.group({
      email: [''],
      smartCard: ['']
    });

    this.setRoleValidators();
  }

  setRoleValidators(): void {
    const emailControl = this.loginForm.get('email');
    const smartCardControl = this.loginForm.get('smartCard');

    if (this.isOwner) {
      emailControl?.setValidators([Validators.required, Validators.email]);
      smartCardControl?.clearValidators();
    } else {
      emailControl?.clearValidators();
      smartCardControl?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{10}$/)  // Ensures exactly 10 digits
      ]);
    }

    emailControl?.updateValueAndValidity();
    smartCardControl?.updateValueAndValidity();
  }

  toggleRole(): void {
    this.isOwner = !this.isOwner;
    this.setRoleValidators(); // Don't rebuild form, just change validation
  }

onRequestOtp(): void {
  this.isLoading = true;

  if (this.loginForm.valid) {
    const identifier = this.isOwner
      ? this.loginForm.get('email')?.value
      : this.loginForm.get('smartCard')?.value;

    const role = this.isOwner ? 'SUBADMIN' : 'USER';

    if (this.isOwner) {
      this.loginService.sendOtp(identifier, role).subscribe({
        next: () => {
          this.showOtpField = true;
          this.isLoading = false; // ✅ stop loader
          alert('OTP sent to your registered email.');
        },
        error: (err) => {
          console.error('OTP request failed', err);
          this.isLoading = false; // ✅ stop loader
          alert('Invalid email.');
        }
      });
    } else {
      this.loginService.getUserBySmartCard(identifier).subscribe({
        next: (user: any) => {
          localStorage.setItem('user', JSON.stringify(user));

          this.showOtpField = true;
          this.isLoading = false; // ✅ stop loader
        },
        error: (err: any) => {
          console.error('Failed to fetch user', err);
          this.isLoading = false; // ✅ stop loader
          alert('Invalid smart card number.');
        }
      });
    }
  } else {
    this.isLoading = false; // ✅ fallback in case form is invalid
  }
}



onVerifyOtp(): void {
  const identifier = this.isOwner
    ? this.loginForm.get('email')?.value
    : this.loginForm.get('smartCard')?.value;

  const role = this.isOwner ? 'SUBADMIN' : 'USER';

  if (this.isOwner) {
    // Email OTP verification
    this.loginService.verifyOtp(identifier, this.otp, role).subscribe({
      next: (user: any) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.navigateBasedOnRole(user.role);
      },
      error: () => {
        alert('Invalid OTP.');
      }
    });
  } else {
    // Smart card login with dummy OTP
    if (this.otp === '123456') {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        alert('User not found. Please request OTP again.');
        return;
      }

      const user = JSON.parse(storedUser);
      this.navigateBasedOnRole(user.role);
    } else {
      alert('Invalid OTP.');
    }
  }
}

navigateBasedOnRole(role: string): void {
  if (role === 'SUBADMIN') {
    this.router.navigate(['/subadmin/dashboard']);
  } else if (role === 'USER') {
    this.router.navigate(['/customer/dashboard']);
  } else {
    alert('Unknown user role.');
  }

}
}
  
