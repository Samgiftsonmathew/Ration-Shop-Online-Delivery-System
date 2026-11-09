package com.example.ration_home_delivery.Repository;

import com.example.ration_home_delivery.Entity.Order;
import com.example.ration_home_delivery.Entity.OrderItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order,Long> {
    List<Order> findByCustomerId(Long customerId);


    List<Order> findBySubAdminId(Long subAdminId);
    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);



}
