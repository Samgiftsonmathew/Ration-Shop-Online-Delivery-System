import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './subadminlist.model';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://192.168.18.49:8080/users/role/SUBADMIN';

  constructor(private http: HttpClient) {}

  createUser(user: any): Observable<User> {
    return this.http.post<User>('http://192.168.18.49:8080/users', user);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  updateUser(id: number, userData: any) {
  return this.http.put(`http://192.168.18.49:8080/users/${id}`, userData);
  }

  deleteUser(userId: number) {
    return this.http.delete(`http://192.168.18.49:8080/users/${userId}`);
  }
}
