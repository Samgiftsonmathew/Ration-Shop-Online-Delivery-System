package com.example.ration_home_delivery.PaymentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/refunds")
@CrossOrigin(origins ="http://localhost:4200")
public class RefundController {

    @Autowired
    private RefundService refundService;

    @PostMapping
    public String refund(@RequestParam String paymentId, @RequestParam int amount) {
        return refundService.initiateRefund(paymentId, amount * 100); // converting to paise
    }
}

