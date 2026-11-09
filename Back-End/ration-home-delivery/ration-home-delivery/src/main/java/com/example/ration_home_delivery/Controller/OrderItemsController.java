package com.example.ration_home_delivery.Controller;

import com.example.ration_home_delivery.Entity.OrderItems;
import com.example.ration_home_delivery.Service.OrderItemsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orderitems")
@CrossOrigin(origins ="http://localhost:4200")

public class OrderItemsController {

    @Autowired
    private OrderItemsService orderItemsService;

    @GetMapping("/{orderId}")
    public ResponseEntity<List<OrderItems>> getOrderItems(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderItemsService.getOrderItemsByOrderId(orderId));
    }
}
