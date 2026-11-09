package com.example.ration_home_delivery.Repository;

import com.example.ration_home_delivery.Entity.DeliveryMan;
import com.example.ration_home_delivery.Entity.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryManRepository extends JpaRepository<DeliveryMan, Long> {
    List<DeliveryMan> findByRegion(Region region);
    Optional<DeliveryMan> findByAadharNum(Long aadharNum);
}
