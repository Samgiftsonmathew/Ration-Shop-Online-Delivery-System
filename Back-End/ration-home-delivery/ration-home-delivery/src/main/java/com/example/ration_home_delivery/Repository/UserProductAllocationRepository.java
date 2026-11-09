package com.example.ration_home_delivery.Repository;

import com.example.ration_home_delivery.Entity.User;
import com.example.ration_home_delivery.Entity.Product;
import com.example.ration_home_delivery.Entity.UserProductAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserProductAllocationRepository extends JpaRepository<UserProductAllocation, Long> {

    List<UserProductAllocation> findByUser(User user);

    Optional<UserProductAllocation> findByUserAndProduct(User user, Product product);

    void deleteByUser(User user);
//    boolean existsByUserAndProduct(User user, Product product);


    List<UserProductAllocation> findByProduct(Product product);

    @Modifying
    @Query("DELETE FROM UserProductAllocation u WHERE u.product.id = :productId")
    void deleteByProductId(@Param("productId") Long productId);
}
