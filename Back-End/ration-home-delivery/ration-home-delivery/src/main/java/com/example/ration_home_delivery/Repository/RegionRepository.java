package com.example.ration_home_delivery.Repository;

import com.example.ration_home_delivery.Entity.Region;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RegionRepository extends JpaRepository<Region, Integer> {

    Optional<Region> findBySubAdminId(Long subAdminId);
}
