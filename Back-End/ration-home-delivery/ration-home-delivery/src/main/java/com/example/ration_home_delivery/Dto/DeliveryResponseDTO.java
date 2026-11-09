package com.example.ration_home_delivery.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class DeliveryResponseDTO {
    private DeliveryManInfo deliveryMan;
    private List<DeliverySummaryDTO> deliveries;

    @Data
    @AllArgsConstructor
    public static class DeliveryManInfo {
        private Long id;
    }
}
