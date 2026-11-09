package com.example.ration_home_delivery.Dto;

import com.example.ration_home_delivery.Enum.CardType;
import lombok.Data;

@Data
public class ProductAllocationDTO {
    private Long id;
    private CardType cardType;
    private int defaultLimit;
}
