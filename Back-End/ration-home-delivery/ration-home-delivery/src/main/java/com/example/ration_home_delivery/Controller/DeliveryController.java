package com.example.ration_home_delivery.Controller;

import com.example.ration_home_delivery.Dto.DeliveryResponseDTO;
import com.example.ration_home_delivery.Entity.Delivery;
import com.example.ration_home_delivery.Entity.DeliveryMan;
import com.example.ration_home_delivery.Entity.User;
import com.example.ration_home_delivery.Repository.DeliveryManRepository;
import com.example.ration_home_delivery.Repository.UserRepository;
import com.example.ration_home_delivery.Service.DeliveryManService;
import com.example.ration_home_delivery.Service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/delivery")
@CrossOrigin(origins ="http://localhost:4200")

public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;



    @PostMapping("/save")
    public ResponseEntity<Delivery> saveDelivery(@RequestBody Delivery delivery) {
        return ResponseEntity.ok(deliveryService.saveDelivery(delivery));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Delivery>> getAllDeliveries() {
        return ResponseEntity.ok(deliveryService.getAllDeliveries());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Delivery> getDeliveryById(@PathVariable Long id) {
        return ResponseEntity.ok(deliveryService.getDeliveryById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDelivery(@PathVariable Long id) {
        deliveryService.deleteDelivery(id);
        return ResponseEntity.ok("Delivery deleted successfully.");
    }

    @GetMapping("/region")
    public ResponseEntity<List<Delivery>> getDeliveriesByRegion(@RequestParam int regionId) {
        return ResponseEntity.ok(deliveryService.getDeliveriesByRegion(regionId));
    }

    @GetMapping("/bydeliveryman/{id}")
    public ResponseEntity<DeliveryResponseDTO> getByDeliveryManGrouped(@PathVariable Long id) {
        DeliveryResponseDTO dto = deliveryService.getDeliveriesGroupedByDeliveryMan(id);
        return ResponseEntity.ok(dto);


    }


}
