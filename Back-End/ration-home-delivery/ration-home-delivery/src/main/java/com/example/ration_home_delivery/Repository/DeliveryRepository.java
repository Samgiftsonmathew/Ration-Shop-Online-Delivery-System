package com.example.ration_home_delivery.Repository;

import com.example.ration_home_delivery.Entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    List<Delivery> findByRegionId(int regionId);
    List<Delivery> findByDeliveryManId(Long deliveryManId);

     Delivery findByOrderId(Long orderId);
}
