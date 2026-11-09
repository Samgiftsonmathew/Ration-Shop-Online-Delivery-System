package com.example.ration_home_delivery.Repository;

import com.example.ration_home_delivery.Entity.ProductAllocation;
import com.example.ration_home_delivery.Enum.CardType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface ProductAllocationRepository extends JpaRepository<ProductAllocation, Long> {

    List<ProductAllocation> findByCardType(CardType cardType);
    Optional<ProductAllocation> findByCardTypeAndProductName(String cardType, String productName);



}
