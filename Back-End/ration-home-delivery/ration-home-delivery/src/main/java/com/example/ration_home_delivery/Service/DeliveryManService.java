package com.example.ration_home_delivery.Service;

import com.example.ration_home_delivery.Entity.DeliveryMan;
import com.example.ration_home_delivery.Entity.Region;
import com.example.ration_home_delivery.Repository.DeliveryManRepository;
import com.example.ration_home_delivery.Repository.RegionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeliveryManService {

    @Autowired
    private DeliveryManRepository deliveryManRepository;

    @Autowired
    private RegionRepository regionRepository;

    public List<DeliveryMan> getAll() {
        return deliveryManRepository.findAll();
    }

    public Optional<DeliveryMan> getById(Long id) {
        return deliveryManRepository.findById(id);
    }

    public List<DeliveryMan> getByRegionId(int regionId) {
        return regionRepository.findById(regionId)
                .map(deliveryManRepository::findByRegion)
                .orElse(null);
    }

    public DeliveryMan create(DeliveryMan man) {
        return deliveryManRepository.save(man);
    }

    public Optional<DeliveryMan> update(Long id, DeliveryMan updatedMan) {
        return deliveryManRepository.findById(id).map(man -> {
            man.setAadharNum(updatedMan.getAadharNum());
            man.setName(updatedMan.getName());
            man.setPhoneNO(updatedMan.getPhoneNO());
            man.setRegion(updatedMan.getRegion());
            return deliveryManRepository.save(man);
        });
    }

    public boolean delete(Long id) {
        if (deliveryManRepository.existsById(id)) {
            deliveryManRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<DeliveryMan> getByAadharNum(Long aadharNum) {
        return deliveryManRepository.findByAadharNum(aadharNum);
    }
}