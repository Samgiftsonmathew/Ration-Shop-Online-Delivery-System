import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginServicesService } from '../../Services/login-services.service';
import { AuthService } from '../../Services/auth.service'; // ✅ Added
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  showOtpField = false;
  otp: string = '';
  email: string = '';
  isRequestingOtp = false;
  isVerifyingOtp = false;
  popupMessage: string = '';
  popupType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginServicesService,
    private authService: AuthService // ✅ Injected
  ) {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
      ]]
    });
  }

  onRequestOtp() {
    if (this.loginForm.valid) {
      this.isRequestingOtp = true;
      this.email = this.loginForm.value.email;
      this.loginService.sendOtp(this.email).subscribe({
        next: () => {
          this.showOtpField = true;
          this.showPopup('OTP sent to your email.', 'success');
          this.isRequestingOtp = false;
        },
        error: (err) => {
          console.error('OTP request failed:', err);
          this.showPopup('Failed to send OTP. Please try again.', 'error');
          this.isRequestingOtp = false;
        }
      });
    }
  }

  onVerifyOtp() {
    if (this.otp.length === 6) {
      this.isVerifyingOtp = true;

      this.loginService.verifyOtp(this.email, this.otp).subscribe({
        next: () => {
          this.authService.login(); // ✅ Mark user as logged in
          this.showPopup('OTP Verified Successfully', 'success');
          this.isVerifyingOtp = false;
          this.router.navigateByUrl('/dashboard');
        },
        error: (err) => {
          console.error('OTP verification failed:', err);
          this.showPopup('Invalid OTP. Please try again.', 'error');
          this.isVerifyingOtp = false;
        }
      });
    } else {
      this.showPopup('Enter a valid 6-digit OTP.', 'error');
    }
  }

  showPopup(message: string, type: 'success' | 'error' = 'success') {
    this.popupMessage = message;
    this.popupType = type;
    setTimeout(() => {
      this.popupMessage = '';
    }, 3000);
  }
}



























// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { LoginServicesService } from '../../Services/login-services.service'; // 🔁 Adjust path if needed
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, FormsModule, ReactiveFormsModule],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   loginForm: FormGroup;
//   showOtpField = false;
//   otp: string = '';
//   email: string = '';
//   isRequestingOtp = false;
//   isVerifyingOtp = false;
//   popupMessage: string = '';
//   popupType: 'success' | 'error' = 'success';



//   constructor(
//     private fb: FormBuilder,
//     private router: Router,
//     private loginService: LoginServicesService
//   ) {
//     this.loginForm = this.fb.group({
//       email: ['', [
//         Validators.required,
//         Validators.email,
//         Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
//       ]]
//     });
//   }

//   onRequestOtp() {
//   if (this.loginForm.valid) {
//     this.isRequestingOtp = true; // Show loader

//     this.email = this.loginForm.value.email;
//     this.loginService.sendOtp(this.email).subscribe({
//       next: () => {
//         this.showOtpField = true;
//         this.showPopup('OTP sent to your email.', 'success');
//         this.isRequestingOtp = false;
//       },
//       error: (err) => {
//         console.error('OTP request failed:', err);
//         this.showPopup('Failed to send OTP. Please try again.', 'error');
//         this.isRequestingOtp = false;
//       }
//     });
//   }
// }


// onVerifyOtp() {
//   if (this.otp.length === 6) {
//     this.isVerifyingOtp = true; // Show loader

//     this.loginService.verifyOtp(this.email, this.otp).subscribe({
//       next: () => {
//         this.showPopup('OTP Verified Successfully', 'success');
//         this.isVerifyingOtp = false;
//         this.router.navigateByUrl('/dashboard');
//       },
//       error: (err) => {
//         console.error('OTP verification failed:', err);
//         this.showPopup('Invalid OTP. Please try again.', 'error');
//         this.isVerifyingOtp = false;
//       }
//     });
//   } else {
//     alert('Enter a valid 6-digit OTP.');
//   }
// }

// showPopup(message: string, type: 'success' | 'error' = 'success') {
//   this.popupMessage = message;
//   this.popupType = type;

//   setTimeout(() => {
//     this.popupMessage = '';
//   }, 3000); // Auto-close after 3s
// }

// }