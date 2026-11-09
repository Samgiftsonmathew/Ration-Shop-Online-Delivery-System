package com.example.ration_home_delivery.PaymentService;

import com.razorpay.RazorpayClient;
import com.razorpay.Refund;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RefundService {

    @Value("${razorpay.key}")
    private String razorpayKeyId;

    @Value("${razorpay.secret}")
    private String razorpayKeySecret;

    public String initiateRefund(String paymentId, int amountInPaise) {
        try {
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject refundRequest = new JSONObject();
            refundRequest.put("amount", amountInPaise); // in paise: ₹1 = 100
            refundRequest.put("payment_id", paymentId);

            Refund refund = razorpayClient.payments.refund(refundRequest);
            return refund.toString();
        } catch (RazorpayException e) {
            e.printStackTrace();
            return "Refund failed: " + e.getMessage();
        }
    }
}
