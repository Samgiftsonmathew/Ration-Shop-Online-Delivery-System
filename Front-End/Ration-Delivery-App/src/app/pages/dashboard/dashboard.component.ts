import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../class/product';

import { CheckoutService } from '../../services/checkout.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  cartItems: Product[] = [];
  cardType: string = '';
  id: number = 0
  regionId:number=0;
  userobject: any;
  constructor(private checkoutService: CheckoutService,
    private authService: AuthService,
    private router: Router,
  ) { }
  ngOnInit(): void {

    const userlist = localStorage.getItem('user');
    const user = JSON.parse(userlist!);
    // console.log('User Card Type:', user);
    this.cardType = user.cardType;
    this.id = user.id;
    this.regionId=user.regionId
    const restoredItems = this.checkoutService.getSelectedItems(); // ✅ get saved selection

    this.loadAllocations();

  }

  // loadAllocations(): void {
  //   this.checkoutService.getAllocationsByCardType(this.cardType, this.id,this.regionId).subscribe({
  //     next: (data) => {
  //       const saved = this.checkoutService.getSelectedItems(); // ✅ previously selected items
  //       console.log(saved);

  //       const hasSaved = saved && saved.length > 0;

  //       const allProducts: Product[] = data.flatMap((allocation: any) =>
  //         allocation.product.map((prod: any) => {
  //           const isDisabled = prod.allocatedQuantity == 0;


  //           return {
  //             ...prod,
  //             quantity: prod.allocatedQuantity, // use full allocated by default
  //             selected: false, // auto-select if available and not previously saved
  //             disabled: isDisabled
  //           };
  //         })

  //       );



  //       if (hasSaved) {
  //         for (const product of allProducts) {
  //           const match = saved.find((s) => s.id === product.id);
  //           if (match) {
  //             product.quantity = match.quantity;
  //             product.selected = !product.disabled && match.selected; // only if not disabled
  //           } else {
  //             product.selected = !product.disabled; // default to selected if not saved
  //           }
  //         }
  //       } else {
  //         // ✅ First-time users: select only available items
  //         for (const product of allProducts) {
  //           product.selected = !product.disabled;
  //         }
  //       }

  //       this.cartItems = allProducts;
  //       console.log('🛒 Final Cart Items:', this.cartItems);
  //     },
  //     error: (err) => {
  //       console.error('❌ Failed to load items:', err);
  //     },
  //   });
  // }
  loadAllocations(): void {
  this.checkoutService.getAllocationsByCardType(this.cardType, this.id,this.regionId).subscribe({
    next: (data) => {
      const saved = this.checkoutService.getSelectedItems(); // ✅ previously selected items
      console.log(saved);

      const hasSaved = saved && saved.length > 0;

      const allProducts: Product[] = data.flatMap((allocation: any) =>
        allocation.product.map((prod: any) => ({
          ...prod,
          quantity: prod.allocatedQuantity,

          selected: !hasSaved && prod.allocatedQuantity > 0, //default to true only if first time
           disabled: prod.allocatedQuantity === 0
        }))
      );

      // ✅ Merge saved selection into loaded products
      if (hasSaved) {
        for (const product of allProducts) {
          const match = saved.find((s) => s.id === product.id);
          if (match) {
            product.selected = match.selected; // ✅ use saved selected state
            product.quantity = match.quantity;
          }
        }
      }

      this.cartItems = allProducts;
      console.log('🛒 Final Cart Items:', this.cartItems);
    },
    error: (err) => {
      console.error('❌ Failed to load items:', err);
    },
  });
}

  increaseQuantity(item: Product) {
    if (item.quantity! < item.allocatedQuantity) {
      item.quantity!++;
    }
  }

  decreaseQuantity(item: Product) {
    if (item.quantity! > 1) {
      item.quantity!--;
    }
  }

  getItemCount(): number {
    return this.cartItems
      .filter((i) => i.selected).length
  }

  getTotalPrice(): number {
    return this.cartItems
      .filter((i) => i.selected)
      .reduce((total, i) => total + i.price * (i.quantity || 0), 0);
  }

  goToOrderSummary() {
    const selected = this.cartItems.filter((p) => p.selected);
    if (selected.length === 0) {
      alert('Select at least one item!');
      return;
    }

    this.checkoutService.setSelectedItems(selected);
    this.router.navigate(['customer/order_summary']);
  }
}
