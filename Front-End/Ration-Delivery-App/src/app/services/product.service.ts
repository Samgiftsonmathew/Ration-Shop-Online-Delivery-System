import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../class/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://192.168.18.49:8080/allocation/bycardtype';

  constructor(private http: HttpClient) {}

  getAllocationsByCardType(cardType: string) {
    const url = `http://192.168.18.49:8080/allocation/bycardtype/${cardType}`;
    return this.http.get<Product[]>(url);
  }
}
