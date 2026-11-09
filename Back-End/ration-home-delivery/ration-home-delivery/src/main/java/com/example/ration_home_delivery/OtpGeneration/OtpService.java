package com.example.ration_home_delivery.OtpGeneration;


import com.example.ration_home_delivery.OtpGeneration.OtpStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private OtpStore otpStore;

    public String generateOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStore.putOtp(email, otp);
        return otp;
    }

    public boolean validateOtp(String email, String otp) {
        String storedOtp = otpStore.getOtp(email);
        if (storedOtp != null && storedOtp.equals(otp)) {
            otpStore.removeOtp(email); // one-time use
            return true;
        }
        return false;
    }
}


