// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockRequest } from '../models/stock-request.model';

export interface Allocation {
  cardType: string;
  defaultLimit: number;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
  price: number;
  allocations: Allocation[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://192.168.18.49:8080/products';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
  return this.http.get<Product[]>('http://192.168.18.51:8080/products/allproducts');
  }

  setStock(stock: StockRequest): Observable<any> {
  return this.http.post('http://192.168.18.51:8080/stocks', stock);
  }


  // 🟢 Fetch all products with allocation
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products/by-region/2`);
  }

  // 🟢 Create new product
  addProduct(product: Product): Observable<any> {
  return this.http.post(`${this.baseUrl}/add`, product, {
    responseType: 'text' as 'json'
  });
}


  // 🟢 Update existing product
 updateProduct(product: Product): Observable<any> {
  return this.http.put(`${this.baseUrl}/update`, product, {
    responseType: 'text' as 'json'  
  });
}


deleteProductByName(name: string): Observable<any> {
  return this.http.delete(`${this.baseUrl}/delete/${name}`, {
    responseType: 'text' as 'json'
  });
}




}


  
