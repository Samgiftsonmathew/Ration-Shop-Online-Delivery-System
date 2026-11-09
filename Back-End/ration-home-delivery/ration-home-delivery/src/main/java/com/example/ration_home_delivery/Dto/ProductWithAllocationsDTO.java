package com.example.ration_home_delivery.Dto;


import com.example.ration_home_delivery.Entity.Region;
import lombok.Data;

import java.util.List;

@Data
public class ProductWithAllocationsDTO {
    private Long id;
    private String name;
    private String category;
    private String imageUrl;
    private double price;
    private List<ProductAllocationDTO> allocations;
    private StockDto stock;
}