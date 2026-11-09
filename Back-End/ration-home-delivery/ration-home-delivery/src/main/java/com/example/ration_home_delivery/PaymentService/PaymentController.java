package com.example.ration_home_delivery.PaymentService;

import com.example.ration_home_delivery.Dto.OrderRequestDTO;
import com.example.ration_home_delivery.Entity.Order;
import com.example.ration_home_delivery.Entity.OrderItems;
import com.example.ration_home_delivery.Enum.Status;
import com.example.ration_home_delivery.Repository.OrderRepository;
import com.example.ration_home_delivery.Service.OrderService;
import com.example.ration_home_delivery.Service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins ="http://localhost:4200")
@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderService  orderService;

    @Autowired
    private StockService stockService;


    @PostMapping("/create-order")
    public String createOrder(@RequestParam int amount, @RequestParam String currency) throws Exception {
        System.out.print("createwd lrder");
        return paymentService.createOrder(amount, currency, "order_rcptid_11");
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<String> verifyPayment(@RequestBody OrderRequestDTO order) {
        try {
            System.out.print("Verify hitted");

            String razorpayOrderId = order.getOrder().getRazorpayOrderId();
            String razorpayPaymentId = order.getOrder().getRazorpayPaymentId();
            String razorpaySignature = order.getOrder().getPaymentSignature();

            boolean isValid = paymentService.verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

            //Optional<Order> optionalOrder = orderRepository.findByRazorpayOrderId(razorpayOrderId);

                if (isValid) {
                    order.getOrder().setPaymentStatus("PAID");
                    Order saveOrder = orderService.placeOrder(order.getOrder(),order.getItems());
                    stockService.reduceStockAndAllocation(saveOrder);
                    return ResponseEntity.ok().build();
                } else {

                    return ResponseEntity.badRequest().body("Payment signature verification failed,Order not placed");
                }

        } catch (Exception e) {
            return ResponseEntity.ok("Error during verification: " + e.getMessage());
        }
    }

}
