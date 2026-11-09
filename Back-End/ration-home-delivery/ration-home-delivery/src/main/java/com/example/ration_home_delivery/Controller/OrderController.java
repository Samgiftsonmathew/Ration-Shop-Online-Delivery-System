package com.example.ration_home_delivery.Controller;

import com.example.ration_home_delivery.Dto.OrderRequestDTO;
import com.example.ration_home_delivery.Entity.Order;
import com.example.ration_home_delivery.Enum.Status;
import com.example.ration_home_delivery.Service.OrderService;
import com.example.ration_home_delivery.Service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins ="http://localhost:4200")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private StockService stockService;

    @PostMapping("/placeorder")
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequestDTO orderRequest) {
        Order placedOrder = orderService.placeOrder(orderRequest.getOrder(), orderRequest.getItems());

        // reduce stocks and allocations
        stockService.reduceStockAndAllocation(placedOrder);

        return ResponseEntity.ok(placedOrder);
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<List<Order>> getOrders(@PathVariable Long customerId) {
        return ResponseEntity.ok(orderService.getOrdersByCustomer(customerId));
    }

    @PutMapping("/updatestatus/{orderId}")
    public ResponseEntity<Order> updateStatus(@PathVariable Long orderId, @RequestParam Status status) {
        Order updatedOrder = orderService.updateOrderStatus(orderId, status);

        // if status is set to CANCELLED, restore stocks and allocations
        if (status == Status.CANCELLED) {
            stockService.restoreStockAndAllocation(updatedOrder);
        }

        return ResponseEntity.ok(updatedOrder);
    }

    @GetMapping("/subadminorders/{subAdminId}")
    public ResponseEntity<List<Order>> getOrdersBySubAdmin(@PathVariable Long subAdminId) {
        return ResponseEntity.ok(orderService.getOrdersBySubAdmin(subAdminId));
    }
}
