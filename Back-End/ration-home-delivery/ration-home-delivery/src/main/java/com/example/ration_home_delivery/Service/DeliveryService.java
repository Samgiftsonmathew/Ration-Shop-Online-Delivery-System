package com.example.ration_home_delivery.Service;
import com.example.ration_home_delivery.Dto.DeliveryResponseDTO;
import com.example.ration_home_delivery.Dto.DeliverySummaryDTO;
import com.example.ration_home_delivery.Entity.Delivery;
import com.example.ration_home_delivery.Entity.DeliveryMan;
import com.example.ration_home_delivery.Entity.User;
import com.example.ration_home_delivery.Repository.DeliveryManRepository;
import com.example.ration_home_delivery.Repository.DeliveryRepository;
import com.example.ration_home_delivery.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeliveryService {

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private DeliveryManRepository deliveryManRepository;

    @Autowired
    private UserRepository userRepository;


    // Read All
    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

    // Read by ID
    public Delivery getDeliveryById(Long id) {
        return deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found with id: " + id));
    }

    // Delete
    public void deleteDelivery(Long id) {
        if (!deliveryRepository.existsById(id)) {
            throw new RuntimeException("Delivery not found with id: " + id);
        }
        deliveryRepository.deleteById(id);
    }

    // Get all deliveries by region
    public List<Delivery> getDeliveriesByRegion(int regionId) {
        return deliveryRepository.findByRegionId(regionId);
    }

    public DeliveryResponseDTO getDeliveriesGroupedByDeliveryMan(Long deliveryManId) {
        List<Delivery> deliveries = deliveryRepository.findByDeliveryManId(deliveryManId);
        List<DeliverySummaryDTO> summaryList = deliveries.stream()
                .map(d ->
                        new DeliverySummaryDTO(
                                d.getOrderId(),
                                d.getStatus(),
                                d.getRegionId(),
                                d.getUser() != null ? d.getUser().getName() : null,
                                d.getUser() != null ? d.getUser().getAddress() : null,
                                d.getUser() != null ? d.getUser().getPhone() : null
                        )
                ).toList();

        return new DeliveryResponseDTO(
                new DeliveryResponseDTO.DeliveryManInfo(deliveryManId),
                summaryList
        );
    }



    public Delivery saveDelivery(Delivery delivery) {
        // Fetch and set DeliveryMan
        if (delivery.getDeliveryMan() != null && delivery.getDeliveryMan().getId() != null) {
            DeliveryMan deliveryMan = deliveryManRepository.findById(delivery.getDeliveryMan().getId())
                    .orElseThrow(() -> new RuntimeException("DeliveryMan not found with id: " + delivery.getDeliveryMan().getId()));
            delivery.setDeliveryMan(deliveryMan);
        }

        // Fetch and set User
        if (delivery.getUser() != null && delivery.getUser().getId() != null) {
            User user = userRepository.findById(delivery.getUser().getId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + delivery.getUser().getId()));
            delivery.setUser(user);
        }

        return deliveryRepository.save(delivery);
    }


}
