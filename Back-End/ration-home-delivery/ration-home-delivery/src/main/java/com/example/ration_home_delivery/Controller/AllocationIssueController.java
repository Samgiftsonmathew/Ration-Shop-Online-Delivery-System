package com.example.ration_home_delivery.Controller;

import com.example.ration_home_delivery.Service.AllocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/allocations")
public class AllocationIssueController {

    @Autowired
    private AllocationService allocationService;

    @PostMapping("/issue")
    public ResponseEntity<String> issueProduct(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam int quantity) {
        allocationService.issueProductToUser(userId, productId, quantity);
        return ResponseEntity.ok("Product allocation updated successfully");
    }
}
