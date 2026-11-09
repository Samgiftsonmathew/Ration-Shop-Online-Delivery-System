package com.example.ration_home_delivery.OtpGeneration;

import com.example.ration_home_delivery.Dto.UserDto;
import com.example.ration_home_delivery.Entity.User;
import com.example.ration_home_delivery.Enum.Role;
import com.example.ration_home_delivery.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin("http://localhost:4200")
public class AdminAuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpService otpService;

    @Autowired
    private MailService mailService;

    // Helper to convert User -> UserDto
    private UserDto buildUserDto(User user) {
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getSmartcardNo(),
                user.getPhone(),
                user.getRole(),
                user.getCardType(),
                user.getCreatedDate(),
                user.getAddress(),
                user.getRegion() != null ? user.getRegion().getId() : 0,
                user.getRole() == Role.USER
                        ? (user.getRegion() != null && user.getRegion().getSubAdmin() != null
                        ? user.getRegion().getSubAdmin().getId()
                        : null)
                        : null
        );
    }

    // POST /auth/send-otp?email=...&role=ADMIN or SUBADMIN
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestParam String email, @RequestParam Role role) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty() || userOpt.get().getRole() != role) {
            return ResponseEntity.badRequest().body("Invalid user role for this email");
        }
        String otp = otpService.generateOtp(email);
        mailService.sendOtpEmail(email, otp);
        return ResponseEntity.ok().build();  // just sends 200 OK, empty body
    }


    // POST /auth/verify-otp?email=...&otp=...
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        if (otpService.validateOtp(email, otp)) {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                UserDto userDto = buildUserDto(userOpt.get());
                return ResponseEntity.ok(userDto);
            } else {
                return ResponseEntity.status(404).body("User not found.");
            }
        }
        return ResponseEntity.badRequest().body("Invalid OTP");
    }
}
