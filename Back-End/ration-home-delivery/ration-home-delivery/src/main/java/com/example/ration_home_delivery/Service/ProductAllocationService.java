package com.example.ration_home_delivery.Service;

import com.example.ration_home_delivery.Entity.Product;
import com.example.ration_home_delivery.Entity.ProductAllocation;
import com.example.ration_home_delivery.Enum.CardType;
import com.example.ration_home_delivery.Repository.ProductAllocationRepository;
import com.example.ration_home_delivery.Repository.ProductRepository;
import com.example.ration_home_delivery.Repository.UserProductAllocationRepository;
import com.example.ration_home_delivery.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductAllocationService {
    @Autowired
    private ProductAllocationRepository allocationRepository;
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProductAllocationRepository userProductAllocationRepository;

    public List<ProductAllocation> getAllocationsByCardType(CardType cardType) {
        return allocationRepository.findByCardType(cardType);
    }

    public List<ProductAllocation> getAllocationsByCardTypeForUser(CardType cardType, Long userId, Long regionId) {
        // Fetch all product allocations for the given card type
        List<ProductAllocation> allocations = allocationRepository.findByCardType(cardType);

        // Get user
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get all products allocated to the user
        var userAllocations = userProductAllocationRepository.findByUser(user);

        // Create map for fast lookup of allocated quantity by product ID
        Map<Long, Integer> userAllocationMap = userAllocations.stream()
                .collect(Collectors.toMap(
                        ua -> ua.getProduct().getId(),
                        ua -> ua.getAllocatedQuantity()
                ));

        // Final filtered result
        List<ProductAllocation> filteredAllocations = new ArrayList<>();

        for (ProductAllocation pa : allocations) {
            // Only include products that belong to the specified region
            List<Product> filteredProducts = new ArrayList<>();

            for (Product product : pa.getProduct()) {
                if (product.getRegion() != null && product.getRegion().getId()==(regionId)) {
                    Integer allocatedQty = userAllocationMap.getOrDefault(product.getId(), 0);
                    product.setAllocatedQuantity(allocatedQty); // Set user-specific allocated quantity
                    filteredProducts.add(product);
                }
            }

            if (!filteredProducts.isEmpty()) {
                ProductAllocation allocationCopy = new ProductAllocation();
                allocationCopy.setId(pa.getId());
                allocationCopy.setCardType(pa.getCardType());
                allocationCopy.setProduct(filteredProducts); // only region-filtered products
                filteredAllocations.add(allocationCopy);
            }
        }

        return filteredAllocations;
    }

    public List<ProductAllocation> getAllocationsByCardTypeForUser(CardType cardType, Long userId) {
        List<ProductAllocation> allocations = allocationRepository.findByCardType(cardType);

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        var userAllocations = userProductAllocationRepository.findByUser(user);

        Map<Long, Integer> userAllocationMap = userAllocations.stream()
                .collect(Collectors.toMap(ua -> ua.getProduct().getId(), ua -> ua.getAllocatedQuantity()));

        for (ProductAllocation pa : allocations) {
            for (Product product : pa.getProduct()) {
                var userQty = userAllocationMap.get(product.getId());
                if (userQty != null) {
                    product.setAllocatedQuantity(userQty);
                }
            }
        }

        return allocations;
    }


}
