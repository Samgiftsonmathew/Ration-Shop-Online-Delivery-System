import { Component, OnInit } from '@angular/core';
import { Product } from '../../class/product';

import { LoginServiceService } from '../../services/login-service.service';

import { Router } from '@angular/router';
import { CheckoutService } from '../../services/checkout.service';
import { PaymentService } from '../../services/payment.service';
import { RazorpayService } from '../../services/razorpay.service';

@Component({
  selector: 'app-customer-ordersummary',
  templateUrl: './customer-ordersummary.component.html',
  styleUrl: './customer-ordersummary.component.css',
})
export class CustomerOrdersummaryComponent implements OnInit {
  cartItems: Product[] = [];
  totalPrice: number = 0;
  user: any;

  constructor(private checkoutService: CheckoutService, private router: Router,
    private paymentService: PaymentService,
    private razorpayService: RazorpayService,
  ) { }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      alert('Missing order data or user info!');
      this.router.navigate(['/customer/dashboard']);
      return;
    }

    this.user = JSON.parse(storedUser);
    this.cartItems = this.checkoutService.getSelectedItems();
    console.log(this.user.regionId)
    if (!this.cartItems || this.cartItems.length === 0) {
      alert('No items selected!');
      this.router.navigate(['/customer/dashboard']);
      return;
    }

    this.totalPrice = this.cartItems.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );


  }
  isPlacingOrder = false;
  payAndPlaceOrder() {
    if (this.isPlacingOrder) return;
    this.isPlacingOrder = true;
    const customer = {
      name: this.user.name,
      email: this.user.email,
      phone: this.user.phone,
    };

    this.paymentService.createRazorpayOrder(this.totalPrice).subscribe({
      next: (razorOrder) => {
        this.razorpayService.openRazorpay(razorOrder, customer, (response) => {
          if (!response) {
            // Razorpay modal closed
            this.isPlacingOrder = false;
            alert('Payment was cancelled.');
            return;
          }
  
          const payload = {
            order: {
              customerId: this.user.id,
              subAdminId: this.user.subAdminId,
              status: 'PENDING',
              totalPrice: this.totalPrice,
              region: { id: this.user.regionId },
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              paymentSignature: response.razorpay_signature
            },
            items: this.cartItems.map((item) => ({
              productId: item.id,
              productName: item.name,
              quantity: item.quantity || 1,
              price: item.price,
            }))
          };

          this.paymentService.verifyRazorpayPayment(payload).subscribe({
            next: (verifyResponse) => {

              this.isPlacingOrder = false;
              console.log('🔒 Payment verified successfully:', verifyResponse);
              alert('Order placed successfully after payment!');
              localStorage.removeItem('orderItems');
              this.router.navigate(['customer/order_history']);
            },
            error: (err) => {
              this.isPlacingOrder = false;
              console.error('Payment verification failed:', err);
              alert('Payment verification failed. Please contact support.');
            },
          });
        });
      },
      error: (err) => {
        this.isPlacingOrder = false;
        console.error('❌ Failed to create Razorpay order:', err);
        alert('Payment setup failed.');
      },
    });
  }

  // placeOrder() {
  //   const payload = {
  //     order: {
  //       customerId: this.user.id,
  //       subAdminId: this.user.subAdminId,
  //       status: 'PENDING',
  //       totalPrice: this.totalPrice,
  //     },
  //     items: this.cartItems.map((item) => ({
  //       productId: item.id,
  //       productName: item.name,
  //       quantity: item.quantity || 1,
  //       price: item.price,
  //     }))
  //   };

  //   console.log('📦 Order Payload:', payload);
  //   if (this.isPlacingOrder) return; // Prevent multiple clicks

  //   this.isPlacingOrder = true;
  //   this.checkoutService.placeOrder(payload).subscribe({
  //     next: (response) => {
  //       this.isPlacingOrder = false;
  //       console.log('✅ Order placed successfully:', response);
  //       localStorage.removeItem('orderItems');
  //       alert("Order placed Successfully!!!")
  //       this.router.navigate(['customer/order_history']);
  //     },
  //     error: (err) => {
  //       this.isPlacingOrder = false;
  //       console.error('❌ Order placement failed:', err);
  //       alert('Order failed. Please try again.');
  //     },
  //   });
  // }
}
