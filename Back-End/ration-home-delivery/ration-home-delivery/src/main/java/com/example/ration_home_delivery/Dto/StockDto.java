package com.example.ration_home_delivery.Dto;

import lombok.Data;

@Data
public class StockDto {
    private Long productId;
    private int quantity;
    private Long subAdminId;
    private int regionId;
}
