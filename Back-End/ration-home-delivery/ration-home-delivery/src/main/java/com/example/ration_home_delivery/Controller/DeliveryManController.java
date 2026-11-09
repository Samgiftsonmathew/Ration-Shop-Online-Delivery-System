package com.example.ration_home_delivery.Controller;

import com.example.ration_home_delivery.Entity.DeliveryMan;
import com.example.ration_home_delivery.Service.DeliveryManService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/deliverymen")
@CrossOrigin(origins ="http://localhost:4200")
public class DeliveryManController {

    @Autowired
    private DeliveryManService deliveryManService;

    // GET all deliverymen
    @GetMapping
    public ResponseEntity<List<DeliveryMan>> getAllDeliveryMen() {
        return ResponseEntity.ok(deliveryManService.getAll());
    }

    // GET by ID
    @GetMapping("/{id}")
    public ResponseEntity<DeliveryMan> getDeliveryManById(@PathVariable Long id) {
        Optional<DeliveryMan> man = deliveryManService.getById(id);
        return man.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // GET by Region ID
    @GetMapping("/region/{regionId}")
    public ResponseEntity<List<DeliveryMan>> getByRegion(@PathVariable int regionId) {
        List<DeliveryMan> men = deliveryManService.getByRegionId(regionId);
        if (men == null || men.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(men);
    }

    // POST - create new delivery man
    @PostMapping("/add")
    public ResponseEntity<DeliveryMan> createDeliveryMan(@RequestBody DeliveryMan man) {
        DeliveryMan saved = deliveryManService.create(man);
        return ResponseEntity.ok(saved);
    }

    // PUT - update delivery man
    @PutMapping("/update/{id}")
    public ResponseEntity<DeliveryMan> updateDeliveryMan(@PathVariable Long id, @RequestBody DeliveryMan updatedMan) {
        Optional<DeliveryMan> updated = deliveryManService.update(id, updatedMan);
        return updated.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // DELETE by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteDeliveryMan(@PathVariable Long id) {
        boolean deleted = deliveryManService.delete(id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
    @GetMapping("/auth/{aadharNum}")
    public ResponseEntity<DeliveryMan> getByAadharNum(@PathVariable Long aadharNum) {
        return deliveryManService.getByAadharNum(aadharNum)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}