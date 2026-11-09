package com.example.ration_home_delivery.Dto;

import com.example.ration_home_delivery.Enum.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliverySummaryDTO {
    private Long orderId;
    private Status status;
    private int regionId;
    private String customerName;
    private String address;
    private Long phNo;
}
