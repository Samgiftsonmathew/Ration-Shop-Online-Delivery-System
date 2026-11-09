package com.example.ration_home_delivery.Dto;

import lombok.Data;

@Data
public class StockRequestDto {
    private Long productId;
    private Integer regionId;
    private Long subAdminId;
    private int quantity;
}
