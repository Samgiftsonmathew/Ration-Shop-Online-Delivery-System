package com.example.ration_home_delivery.Service;

import com.example.ration_home_delivery.Entity.Delivery;
import com.example.ration_home_delivery.Entity.Order;
import com.example.ration_home_delivery.Entity.OrderItems;
import com.example.ration_home_delivery.Enum.Status;
import com.example.ration_home_delivery.Repository.DeliveryRepository;
import com.example.ration_home_delivery.Repository.OrderRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private DeliveryRepository deliveryRepository;

    @Transactional
    public Order placeOrder(Order order, List<OrderItems> items) {
        for (OrderItems item : items) {
            item.setOrder(order);  // Set the relationship
        }
        order.setItems(items); // Attach items to the order
        return orderRepository.save(order);
    }

    public List<Order> getOrdersByCustomer(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    public Order updateOrderStatus(Long orderId, Status newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        // Update order status
        order.setStatus(newStatus);

        // Also update delivery status if a delivery exists for the order
        Delivery delivery = deliveryRepository.findByOrderId(orderId);
        if (delivery != null) {
            delivery.setStatus(newStatus);
            deliveryRepository.save(delivery);
        }

        return orderRepository.save(order);
    }


    public List<Order> getOrdersBySubAdmin(Long subAdminId) {
        return orderRepository.findBySubAdminId(subAdminId);
    }


}
