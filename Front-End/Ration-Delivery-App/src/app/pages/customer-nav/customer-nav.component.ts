import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-nav',
  templateUrl: './customer-nav.component.html',
  styleUrl: './customer-nav.component.css'
})
export class CustomerNavComponent implements OnInit {
  cartCount: number = 3;
  userlist:any;
  constructor(private router: Router) { }
  ngOnInit(): void {
     const userlist = localStorage.getItem('user');
    const user = JSON.parse(userlist!);
    this.userlist=user
    console.log(this.userlist.name)
  }
  logout(): void {
    localStorage.removeItem('user'); // Clear saved user
    this.router.navigate(['/']);     // Redirect to login page
  }
}
