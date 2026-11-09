package com.example.ration_home_delivery.Repository;

import com.example.ration_home_delivery.Entity.Product;
import com.example.ration_home_delivery.Entity.Region;
import com.example.ration_home_delivery.Entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    Stock findByProduct(Product product);

    Stock findByProductAndRegion(Product product, Region region);

    List<Stock> findBySubAdminId(Long subAdminId);
    List<Stock> findByRegionId(int regionId);


    Optional<Stock> findByProductIdAndRegionIdAndSubAdminId(Long productId, int regionId, Long subAdminId);
    List<Stock> findAllByProductId(Long productId);
    List<Stock> findByProductId(Long productId);
    @Query("SELECT s FROM Stock s WHERE s.product.name = :productName AND s.region.id = :regionId AND s.subAdminId = :subAdminId")
    Optional<Stock> findByProductNameAndRegionIdAndSubAdminId(
            @Param("productName") String productName,
            @Param("regionId") int regionId,
            @Param("subAdminId") Long subAdminId
    );



}

