package com.example.ration_home_delivery.Service;

import com.example.ration_home_delivery.Entity.UserProductAllocation;
import com.example.ration_home_delivery.Repository.UserProductAllocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AllocationResetScheduler {

    private final UserProductAllocationRepository userProductAllocationRepository;

    // Run at midnight on the first day of each month
    @Scheduled(cron = "0 0 0 1 * *")
    public void resetUserAllocations() {
        List<UserProductAllocation> allocations = userProductAllocationRepository.findAll();

        for (UserProductAllocation upa : allocations) {
            int defaultLimit = upa.getProduct().getAllocatedQuantity(); // Reset to default limit
            upa.setAllocatedQuantity(defaultLimit);
            userProductAllocationRepository.save(upa);
        }

        System.out.println("✅ Monthly user allocations reset successfully.");
    }
}
