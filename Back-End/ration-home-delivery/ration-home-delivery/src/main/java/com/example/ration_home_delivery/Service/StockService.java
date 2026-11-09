package com.example.ration_home_delivery.Service;

import com.example.ration_home_delivery.Dto.StockDto;
import com.example.ration_home_delivery.Dto.StockRequestDto;
import com.example.ration_home_delivery.Entity.*;
import com.example.ration_home_delivery.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StockService {

    private final StockRepository stockRepository;
    private final ProductRepository productRepository;
    private final RegionRepository regionRepository;
    private final UserRepository userRepository;
    private final UserProductAllocationRepository userProductAllocationRepository;

    // Called when order is cancelled — restores stock and user's allocation
    public void restoreStockAndAllocation(Order order) {
        User user = userRepository.findById(order.getCustomerId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + order.getCustomerId()));

        Region region = regionRepository.findBySubAdminId(order.getSubAdminId())
                .orElseThrow(() -> new RuntimeException("Region not found for SubAdmin ID: " + order.getSubAdminId()));

        for (OrderItems item : order.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + item.getProductId()));

            // Restore user allocation
            UserProductAllocation allocation = userProductAllocationRepository.findByUserAndProduct(user, product)
                    .orElseThrow(() -> new RuntimeException("User allocation not found for user " + user.getId() + " and product " + product.getName()));
            allocation.setAllocatedQuantity(allocation.getAllocatedQuantity() + item.getQuantity());
            userProductAllocationRepository.save(allocation);

            // Restore stock
            Stock stock = stockRepository.findByProductAndRegion(product, region);
            if (stock == null) {
                throw new RuntimeException("Stock not found for product " + product.getName() + " in region " + region.getName());
            }
            stock.setQuantity(stock.getQuantity() + item.getQuantity());
            stockRepository.save(stock);
        }
    }

    // Called when an order is placed — deducts from stock and user allocation
    public void reduceStockAndAllocation(Order order) {
        User user = userRepository.findById(order.getCustomerId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + order.getCustomerId()));

        for (OrderItems item : order.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + item.getProductId()));

            // Deduct from user allocation
            UserProductAllocation allocation = userProductAllocationRepository.findByUserAndProduct(user, product)
                    .orElseThrow(() -> new RuntimeException("User allocation not found for user " + user.getId() + " and product " + product.getName()));

            if (allocation.getAllocatedQuantity() < item.getQuantity()) {
                throw new RuntimeException("Insufficient allocated quantity for product: " + product.getName());
            }

            allocation.setAllocatedQuantity(allocation.getAllocatedQuantity() - item.getQuantity());
            userProductAllocationRepository.save(allocation);

            // Deduct from stock
            Stock stock = stockRepository.findByProductAndRegion(product, user.getRegion());
            if (stock == null) {
                throw new RuntimeException("Stock not found for product " + product.getName() + " in region " + user.getRegion().getName());
            }

            if (stock.getQuantity() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            stock.setQuantity(stock.getQuantity() - item.getQuantity());
            stockRepository.save(stock);
        }
    }

    public Stock createOrUpdateStock(StockRequestDto request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Region region = regionRepository.findById(request.getRegionId())
                .orElseThrow(() -> new RuntimeException("Region not found"));

        Stock stock = stockRepository.findByProductAndRegion(product, region);
        if (stock == null) {
            stock = new Stock();
            stock.setProduct(product);
            stock.setRegion(region);
            stock.setSubAdminId(request.getSubAdminId());
        }

        stock.setQuantity(request.getQuantity());
        return stockRepository.save(stock);
    }

    public void bulkSaveStocks(List<StockDto> stocks) {
        for (StockDto dto : stocks) {
            Product product = productRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            Region region = regionRepository.findById(dto.getRegionId())
                    .orElseThrow(() -> new RuntimeException("Region not found"));

            Stock stock = new Stock();
            stock.setProduct(product);
            stock.setQuantity(dto.getQuantity());
            stock.setSubAdminId(dto.getSubAdminId());
            stock.setRegion(region);

            stockRepository.save(stock);
        }
    }

    public List<Stock> getStocksBySubAdmin(Long subAdminId) {
        return stockRepository.findBySubAdminId(subAdminId);
    }

    public List<Stock> getStocksByRegion(int regionId) {
        return stockRepository.findByRegionId(regionId);
    }

    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }
}
