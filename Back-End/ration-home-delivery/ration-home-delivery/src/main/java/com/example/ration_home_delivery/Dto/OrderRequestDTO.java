package com.example.ration_home_delivery.Dto;

import com.example.ration_home_delivery.Entity.Order;
import com.example.ration_home_delivery.Entity.OrderItems;
import lombok.Data;
import java.util.List;

@Data
public class OrderRequestDTO {
    private Order order;
    private List<OrderItems> items;
}
