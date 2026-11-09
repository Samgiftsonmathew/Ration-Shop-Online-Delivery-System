import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userObj=  new BehaviorSubject<any>(null);
    userdetails: Observable<any> = this.userObj.asObservable();
  

  setUser(user:any):void{
    this.userObj.next(user)
  }

  getuser():any{
    return this.userObj.value
  }
}
