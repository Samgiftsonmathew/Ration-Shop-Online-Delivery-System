package com.example.ration_home_delivery.Controller;

import com.example.ration_home_delivery.Dto.RegionMinimalDto;
import com.example.ration_home_delivery.Entity.Region;
import com.example.ration_home_delivery.Repository.RegionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/regions")
@CrossOrigin(origins ="http://localhost:4200")

public class RegionController {

    @Autowired
    private RegionRepository regionRepository;

    @GetMapping
    public List<RegionMinimalDto> getAllRegions() {
        return regionRepository.findAll()
                .stream()
                .map(region -> new RegionMinimalDto(region.getId(), region.getName()))
                .toList();
    }

}
