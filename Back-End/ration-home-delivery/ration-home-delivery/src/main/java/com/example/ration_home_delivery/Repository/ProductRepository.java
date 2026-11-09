package com.example.ration_home_delivery.Repository;

import com.example.ration_home_delivery.Entity.Product;
import com.example.ration_home_delivery.Enum.CardType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByName(String name);
    void deleteByName(String name);
    @Query("SELECT p FROM Product p JOIN Stock s ON p.id = s.product.id WHERE p.name = :name AND s.region.id = :regionId")
    List<Product> findByNameAndRegionId(@Param("name") String name, @Param("regionId") int regionId);
    List<Product> findByNameIgnoreCaseAndAllocation_CardType(String name, CardType cardType);





}
