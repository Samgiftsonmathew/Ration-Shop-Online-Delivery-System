package com.example.ration_home_delivery.Service;

import com.example.ration_home_delivery.Dto.ProductAllocationItemDto;
import com.example.ration_home_delivery.Dto.UserAllocationDto;
import com.example.ration_home_delivery.Entity.*;
import com.example.ration_home_delivery.Enum.CardType;
import com.example.ration_home_delivery.Repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AllocationService {

    private final ProductAllocationRepository productAllocationRepository;
    private final UserProductAllocationRepository userProductAllocationRepository;
    private final UserRepository userRepository;
    private final AllocationRepository allocationRepository;
    private final ProductRepository productRepository;



//    @Transactional
//    public void initializeAllocationsForAllUsers(User user) {
//
//        userProductAllocationRepository.deleteByUser(user);
//
//        List<User> users = userRepository.findAll();
//        for (User user : users) {
//            initializeUserAllocation(user);
//        }
//        System.out.println("Allocations initialized for all users based on card type.");
//    }

    @Transactional
    public void initializeUserAllocation(User user) {
        if (user.getCardType() == null) {
            System.out.println("Skipping user " + user.getName() + " because card type is null.");
            return;
        }

        List<ProductAllocation> allocations = productAllocationRepository.findByCardType(user.getCardType());
        if (allocations.isEmpty()) {
            throw new RuntimeException("No allocation found for card type " + user.getCardType());
        }

        for (ProductAllocation allocation : allocations) {
            for (Product product : allocation.getProduct()) {
                UserProductAllocation upa = new UserProductAllocation();
                upa.setUser(user);
                upa.setProduct(product);
                upa.setAllocatedQuantity(product.getAllocatedQuantity());
                userProductAllocationRepository.save(upa);
            }
        }
    }

    public UserAllocationDto getUserAllocations(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CardType cardType = user.getCardType();

        // fetch all products user is entitled to
        List<ProductAllocation> entitlements = allocationRepository.findByCardType(cardType);

        // fetch actual allocations for the user
        List<UserProductAllocation> userAllocations = userProductAllocationRepository.findByUser(user);

        // map for quick lookup
        Map<String, Integer> userAllocMap = userAllocations.stream()
                .collect(Collectors.toMap(
                        upa -> upa.getProduct().getName(),
                        UserProductAllocation::getAllocatedQuantity
                ));

        // build DTO list
        List<ProductAllocationItemDto> allocationDtos = new ArrayList<>();

        for (ProductAllocation entitlement : entitlements) {
            for (Product product : entitlement.getProduct()) {
                String productName = product.getName();
                int allocatedQuantity = userAllocMap.getOrDefault(productName, 0);

                ProductAllocationItemDto dto = new ProductAllocationItemDto();
                dto.setProductName(productName);
                dto.setAllocatedQuantity(allocatedQuantity);

                allocationDtos.add(dto);
            }
        }


        // build user DTO
        UserAllocationDto userDto = new UserAllocationDto();
        userDto.setUserId(user.getId());
        userDto.setUserName(user.getName());
        userDto.setAllocations(allocationDtos);

        return userDto;
    }

    @Transactional
    public void issueProductToUser(Long userId, Long productId, int quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if allocation already exists for this user and product
        Optional<UserProductAllocation> existingAllocOpt =
                userProductAllocationRepository.findByUserAndProduct(user, product);

        if (existingAllocOpt.isPresent()) {
            // Update existing quantity
            UserProductAllocation existingAlloc = existingAllocOpt.get();
            existingAlloc.setAllocatedQuantity(existingAlloc.getAllocatedQuantity() + quantity);
            userProductAllocationRepository.save(existingAlloc);
        } else {
            // Create new allocation record
            UserProductAllocation newAlloc = new UserProductAllocation();
            newAlloc.setUser(user);
            newAlloc.setProduct(product);
            newAlloc.setAllocatedQuantity(quantity);
            userProductAllocationRepository.save(newAlloc);
        }
    }
}

