import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl:'./app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Admin-App-Front-End';

  sessionExpired = false;

  constructor(private router: Router) {
    // Listen for session expiration broadcast
    window.addEventListener('sessionExpired', () => {
      this.sessionExpired = true;

      // Auto-redirect after 2.5 seconds
      setTimeout(() => {
        this.sessionExpired = false;
        this.router.navigate(['/login']);
      }, 2500);
    });
  }
}
