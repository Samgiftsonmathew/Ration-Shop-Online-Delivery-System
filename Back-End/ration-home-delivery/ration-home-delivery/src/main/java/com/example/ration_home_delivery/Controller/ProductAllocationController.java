package com.example.ration_home_delivery.Controller;

import com.example.ration_home_delivery.Entity.ProductAllocation;
import com.example.ration_home_delivery.Enum.CardType;
import com.example.ration_home_delivery.Service.AllocationResetScheduler;
import com.example.ration_home_delivery.Service.ProductAllocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/allocation")
@CrossOrigin(origins ="http://localhost:4200")

public class ProductAllocationController {
    @Autowired

    private ProductAllocationService allocationService;

    @Autowired
    private AllocationResetScheduler allocationResetScheduler;

    @GetMapping("/bycardtype/{cardType}")
    public List<ProductAllocation> getAllocationsByCardType(@PathVariable CardType cardType) {
        return allocationService.getAllocationsByCardType(cardType);
    }

    @GetMapping("/allocations/user/{userId}/region/{regionId}/card-type/{cardType}")
    public ResponseEntity<List<ProductAllocation>> getAllocations(
            @PathVariable Long userId,
            @PathVariable Long regionId,
            @PathVariable CardType cardType) {
        return ResponseEntity.ok(allocationService.getAllocationsByCardTypeForUser(cardType, userId, regionId));
    }


    @GetMapping("/bycardtype/{cardType}/user/{userId}")
    public List<ProductAllocation> getAllocationsByCardTypeForUser(
            @PathVariable CardType cardType,
            @PathVariable Long userId) {
        return allocationService.getAllocationsByCardTypeForUser(cardType, userId);
    }

    @PostMapping("/reset-allocations")
    public String resetUserAllocationsManually() {
        allocationResetScheduler.resetUserAllocations();
        return "✅ User allocations reset manually.";
    }

}
