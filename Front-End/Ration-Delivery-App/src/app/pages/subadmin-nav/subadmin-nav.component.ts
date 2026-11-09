import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subadmin-nav',
  templateUrl: './subadmin-nav.component.html',
  styleUrl: './subadmin-nav.component.css'
})
export class SubadminNavComponent implements OnInit {
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
    this.router.navigate(['/']);
}
}
