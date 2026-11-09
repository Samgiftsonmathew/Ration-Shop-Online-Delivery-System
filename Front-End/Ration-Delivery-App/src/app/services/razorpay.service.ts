import { Injectable } from '@angular/core';
declare var Razorpay: any;
@Injectable({
  providedIn: 'root'
})
export class RazorpayService {

  constructor() { }

  openRazorpay(order: any, user: any, callback: (res: any) => void) {
    const options = {
      key: 'rzp_test_oVzw3fHoMbi2ib', // from Razorpay dashboard
      amount: order.amount,
      currency: 'INR',
      name: 'Ration Home delivery',
      description: 'Order Payment',
      order_id: order.id,
      handler: callback,
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone,
      },
      theme: {
        color: '#0aaf8d',
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }
}
