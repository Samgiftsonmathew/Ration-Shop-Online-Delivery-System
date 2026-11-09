import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ProductAllocationDTO {
  id: number;
  cardType: 'AAY' | 'PHH' | 'NPHH' | string;
  defaultLimit: number;
}

export interface StockDto {
  productId: number | null;
  quantity: number;
  subAdminId: number;
  regionId: number;
}

export interface ProductWithAllocationsDTO {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
  price: number;
  allocations: ProductAllocationDTO[];
  stock: StockDto;
}

export interface Region {
  id: number;
  name: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: ProductWithAllocationsDTO[] = [];
  regions: Region[] = [];
  selectedRegionId: number = 1;
  selectedCardType: string = '';
  cardTypes: string[] = ['AAY', 'PHH', 'NPHH'];

  showModal = false;
  showDeleteConfirm = false;
  isEditing = false;
  editIndex = -1;

  subAdmins: any[] = []; // fill this from API
regionToSubAdminMap: { [regionId: number]: number } = {};

  newProduct: any = {};
  productToDelete: ProductWithAllocationsDTO | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    console.log('✅ ProductsComponent loaded');
    this.fetchRegions();
    this.fetchProductsByRegion();
    this.loadSubAdmins();
  }

  fetchRegions() {
    this.http.get<Region[]>('http://192.168.18.49:8080/regions').subscribe(data => {
      this.regions = data;
    });
  }

  loadSubAdmins() {
  this.http.get<any[]>('http://192.168.18.49:8080/users/role/SUBADMIN').subscribe(data => {
    this.subAdmins = data;
    this.regionToSubAdminMap = {};
    data.forEach(subAdmin => {
      this.regionToSubAdminMap[subAdmin.regionId] = subAdmin.id;
    });
  });
}


  onRegionChange(regionId: string) {
    this.selectedRegionId = +regionId;
    this.fetchProductsByRegion();
  }

  fetchProductsByRegion() {
    if (this.selectedRegionId === 0) return;
    const url = `http://192.168.18.49:8080/products/products/by-region/${this.selectedRegionId}`;
    this.http.get<ProductWithAllocationsDTO[]>(url).subscribe(data => {
      this.products = data;
    });
  }

  filteredProducts(): ProductWithAllocationsDTO[] {
    if (!this.selectedCardType) return this.products;
    return this.products.filter(product =>
      product.allocations.some(a => a.cardType === this.selectedCardType)
    );
  }

  getAllocationText(product: ProductWithAllocationsDTO): string {
    if (!product.allocations || product.allocations.length === 0) return 'N/A';
    if (!this.selectedCardType) {
      return product.allocations.map(a => `${a.cardType}: ${a.defaultLimit}`).join(', ');
    }
    const match = product.allocations.find(a => a.cardType === this.selectedCardType);
    return match ? `${match.defaultLimit}` : 'N/A';
  }

  openModal() {
    this.showModal = true;
    console.log('🟢 Modal opened');
    this.isEditing = false;
    this.newProduct = {
      name: '',
      category: '',
      price: 0,
      imageUrl: '',
      allocations: this.cardTypes.map(card => ({
        cardType: card,
        defaultLimit: 0
      })),
      stock: {
        productId: null,
        quantity: 100,
        subAdminId: 1,
        regionId: this.selectedRegionId
      }
    };
  }

  closeModal() {
    this.showModal = false;
  }

  addProduct() {
  // Get subAdminId from selectedRegionId
  const subAdminId = this.regionToSubAdminMap[this.selectedRegionId];

  const payload = {
    ...this.newProduct,
    stock: {
      ...this.newProduct.stock,
      regionId: this.selectedRegionId,
      subAdminId: subAdminId   // ✅ Inject subAdminId here
    }
  };

  const url = this.isEditing
    ? 'http://192.168.18.49:8080/products/update'
    : 'http://192.168.18.49:8080/products/add';

  const method = this.isEditing ? 'put' : 'post';

  this.http.request(method, url, {
    body: payload,
    responseType: 'text'
  }).subscribe({
    next: (response: any) => {
      if (this.isEditing) {
        this.products[this.editIndex] = { ...response };
      } else {
        this.products.push(response);
      }
      this.closeModal();
      this.fetchProductsByRegion();
    },
    error: (error) => {
      console.error('Error saving product:', error);
      alert('Failed to save product.');
    }
  });
}


  editProduct(product: ProductWithAllocationsDTO, index: number) {
    console.log('✏️ Edit clicked:', product.name, 'at index', index);
    this.newProduct = {
      name: product.name,
      category: product.category,
      price: product.price,
      imageUrl: product.imageUrl,
      allocations: product.allocations.map(a => ({ ...a })),
      stock: { ...product.stock }
    };
    this.isEditing = true;
    this.editIndex = index;
    this.showModal = true;
  }

  deleteProduct(product: ProductWithAllocationsDTO, index: number) {
    console.log('🗑 Delete clicked:', product.name, 'at index', index);
    this.productToDelete = product;
    this.editIndex = index;
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    const regionId = this.selectedRegionId;
    const productName = this.productToDelete?.name;

    if (!productName || !regionId) {
      alert('Missing product name or region ID!');
      return;
    }

    this.http.delete(`http://192.168.18.49:8080/products/delete-by-name-region?name=${productName}&regionId=${regionId}`).subscribe({
      next: () => {
        this.products.splice(this.editIndex, 1);
        this.showDeleteConfirm = false;
        this.productToDelete = null;
      },
      error: (err) => {
        console.error('Failed to delete product:', err);
        alert('Failed to delete product.');
      }
    });
  }

  increaseLimit(i: number) {
    this.newProduct.allocations[i].defaultLimit++;
  }

  decreaseLimit(i: number) {
    if (this.newProduct.allocations[i].defaultLimit > 0) {
      this.newProduct.allocations[i].defaultLimit--;
    }
  }

  testClick() {
    console.log("✅ Test button clicked!");
  }
}
