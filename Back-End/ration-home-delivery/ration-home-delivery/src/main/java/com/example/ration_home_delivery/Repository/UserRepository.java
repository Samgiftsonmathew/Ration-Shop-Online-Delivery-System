package com.example.ration_home_delivery.Repository;

import com.example.ration_home_delivery.Entity.Region;
import com.example.ration_home_delivery.Entity.User;
import com.example.ration_home_delivery.Enum.CardType;
import com.example.ration_home_delivery.Enum.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findByRegion(Region region);

    List<User> findByCardType(CardType cardType);

    Optional<User> findBySmartcardNo(Long smartcardNo);

    Optional<User> findByEmail(String email);

    List<User> findByRegionId(int regionId);

    List<User> findByRole(Role role);



}
