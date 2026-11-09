package com.example.ration_home_delivery.Service;

import com.example.ration_home_delivery.Dto.ProductAllocationDTO;
import com.example.ration_home_delivery.Dto.ProductWithAllocationsDTO;
import com.example.ration_home_delivery.Dto.StockDto;
import com.example.ration_home_delivery.Entity.*;
import com.example.ration_home_delivery.Enum.CardType;
import com.example.ration_home_delivery.Repository.*;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private RegionRepository regionRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StockRepository stockRepository;
    @Autowired
    private ProductAllocationRepository allocationRepository;
    @Autowired
    private UserProductAllocationRepository userProductAllocationRepository;
    @Autowired
    private AllocationService allocationService;

    public void saveProductWithAllocations(ProductWithAllocationsDTO dto) {
        StockDto stockDto = dto.getStock();
        if (stockDto == null) {
            throw new RuntimeException("Stock details are required (regionId, subAdminId, quantity)");
        }

        // Fetch Region from RegionRepository
        Region region = regionRepository.findById(stockDto.getRegionId())
                .orElseThrow(() -> new RuntimeException("Region not found for ID: " + stockDto.getRegionId()));

        for (ProductAllocationDTO allocDTO : dto.getAllocations()) {
            Product product = new Product();
            product.setName(dto.getName());
            product.setCategory(dto.getCategory());
            product.setImageUrl(dto.getImageUrl());
            product.setPrice(dto.getPrice());
            product.setDefaultLimit(allocDTO.getDefaultLimit());
            product.setAllocatedQuantity(allocDTO.getDefaultLimit());
            product.setRegion(region); // ✅ Set region in product

            // Fetch or create ProductAllocation
            ProductAllocation allocation = allocationRepository
                    .findByCardType(allocDTO.getCardType())
                    .stream()
                    .findFirst()
                    .orElseGet(() -> {
                        ProductAllocation newAlloc = new ProductAllocation();
                        newAlloc.setCardType(allocDTO.getCardType());
                        return allocationRepository.save(newAlloc);
                    });

            product.setAllocation(allocation);

            // Save product
            Product savedProduct = productRepository.save(product);

            // ✅ Insert or update stock using helper method
            upsertStock(savedProduct, stockDto.getRegionId(), stockDto.getSubAdminId(), stockDto.getQuantity());

            // ✅ Initialize user-product allocation for users with the same card type
            List<User> usersWithThisCardType = userRepository.findByCardType(allocDTO.getCardType());
            for (User user : usersWithThisCardType) {
                allocationService.issueProductToUser(user.getId(), savedProduct.getId(), allocDTO.getDefaultLimit());
            }
        }
    }

    @Transactional
    public void updateProductWithAllocations(ProductWithAllocationsDTO dto) {
        String productName = dto.getName();
        int regionId = dto.getStock() != null ? dto.getStock().getRegionId() : -1;
        Long subAdminId = dto.getStock() != null ? dto.getStock().getSubAdminId() : null;

        for (ProductAllocationDTO allocDTO : dto.getAllocations()) {
            CardType cardType = allocDTO.getCardType();

            // 1. Get all products with the given name and cardType
            List<Product> matchingProducts = productRepository
                    .findByNameIgnoreCaseAndAllocation_CardType(productName, cardType);

            if (matchingProducts.isEmpty()) {
                throw new RuntimeException("No products found for name: " + productName + " and cardType: " + cardType);
            }

            for (Product product : matchingProducts) {
                // 2. Update product fields
                product.setCategory(dto.getCategory());
                product.setImageUrl(dto.getImageUrl());
                product.setPrice(dto.getPrice());
                product.setDefaultLimit(allocDTO.getDefaultLimit());
                product.setAllocatedQuantity(allocDTO.getDefaultLimit());

                if (dto.getStock() != null) {
                    Region region = regionRepository.findById(dto.getStock().getRegionId())
                            .orElseThrow(() -> new RuntimeException("Region not found with ID: " + dto.getStock().getRegionId()));
                    product.setRegion(region);
                }

                // 3. Save updated product
                Product updatedProduct = productRepository.save(product);

                // Update user allocations if needed
                List<UserProductAllocation> allocations = userProductAllocationRepository.findByProduct(updatedProduct);
                for (UserProductAllocation allocation : allocations) {
                    allocation.setAllocatedQuantity(updatedProduct.getAllocatedQuantity());
                    userProductAllocationRepository.save(allocation);
                }


                // 4. Update or insert stock
                if (dto.getStock() != null) {
                    upsertStock(updatedProduct, regionId, subAdminId, dto.getStock().getQuantity());
                }
            }
        }
    }

    private void upsertStock(Product product, int regionId, Long subAdminId, int quantity) {
        Optional<Stock> optionalStock = stockRepository
                .findByProductIdAndRegionIdAndSubAdminId(product.getId(), regionId, subAdminId);

        if (optionalStock.isPresent()) {
            // ✅ Update existing stock
            Stock existingStock = optionalStock.get();
            existingStock.setQuantity(quantity);
            stockRepository.save(existingStock);
        } else {
            // ✅ Insert new stock
            Region region = regionRepository.findById(regionId)
                    .orElseThrow(() -> new RuntimeException("Region not found with ID: " + regionId));

            Stock newStock = new Stock();
            newStock.setProduct(product);
            newStock.setRegion(region);
            newStock.setSubAdminId(subAdminId);
            newStock.setQuantity(quantity);

            stockRepository.save(newStock);
        }
    }




    public List<ProductWithAllocationsDTO> getAllProductsWithMergedAllocationsByRegion(Long regionId) {
        List<Product> products = productRepository.findAll();
        Map<String, ProductWithAllocationsDTO> productMap = new LinkedHashMap<>();

        for (Product product : products) {
            List<Stock> stocks = stockRepository.findAllByProductId(product.getId());
            if (stocks == null || stocks.isEmpty()) continue;

            for (Stock stock : stocks) {
                if (stock.getRegion() == null || !(stock.getRegion().getId() == (regionId))) {
                    continue; // Skip stock that doesn't match the region
                }

                String key = product.getName() + "|" + product.getCategory() + "|" + product.getImageUrl() + "|" + product.getPrice()
                        + "|" + stock.getRegion().getId() + "|" + stock.getSubAdminId();

                ProductWithAllocationsDTO dto = productMap.getOrDefault(key, new ProductWithAllocationsDTO());
                if (dto.getId() == null) {
                    dto.setId(product.getId());
                    dto.setName(product.getName());
                    dto.setCategory(product.getCategory());
                    dto.setImageUrl(product.getImageUrl());
                    dto.setPrice(product.getPrice());
                    dto.setAllocations(new ArrayList<>());

                    StockDto stockDto = new StockDto();
                    stockDto.setQuantity(stock.getQuantity());
                    stockDto.setRegionId(stock.getRegion().getId());
                    stockDto.setSubAdminId(stock.getSubAdminId());
                    dto.setStock(stockDto);
                }

                // Add allocation
                ProductAllocation allocation = product.getAllocation();
                if (allocation != null) {
                    ProductAllocationDTO allocDto = new ProductAllocationDTO();
                    allocDto.setId(allocation.getId());
                    allocDto.setCardType(allocation.getCardType());
                    allocDto.setDefaultLimit(product.getDefaultLimit());
                    dto.getAllocations().add(allocDto);
                }

                productMap.put(key, dto);
            }
        }

        return new ArrayList<>(productMap.values());
    }


    public boolean deleteProductById(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Transactional

    public boolean deleteProductsByNameAndRegionId(String name, int regionId) {

        List<Product> products = productRepository.findByName(name);

        List<Product> toDelete = new ArrayList<>();

        for (Product product : products) {

            List<Stock> stocks = stockRepository.findByProductId(product.getId());

            for (Stock stock : stocks) {

                if (stock.getRegion() != null && stock.getRegion().getId() == regionId) {

                    // 1️⃣ Delete stock entries first

                    stockRepository.delete(stock);

                    // 2️⃣ Delete entries from user_product_allocation

                    userProductAllocationRepository.deleteByProductId(product.getId());

                    // 3️⃣ Mark product for deletion

                    toDelete.add(product);

                    break;

                }

            }

        }

        if (!toDelete.isEmpty()) {

            productRepository.deleteAll(toDelete);

            return true;

        }

        return false;

    }




    public List<Product> getAll() {
        return productRepository.findAll();


    }



}
