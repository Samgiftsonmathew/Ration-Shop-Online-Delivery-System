package com.example.ration_home_delivery.Controller;

import com.example.ration_home_delivery.Enum.CardType;
import com.example.ration_home_delivery.Enum.Role;
import com.example.ration_home_delivery.Enum.Status;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/enums")
public class EnumController {

    @GetMapping("/roles")
    public ResponseEntity<List<String>> getAllRoles() {
        List<String> roles = Arrays.stream(Role.values())
                .map(Enum::name)
                .collect(Collectors.toList());
        return ResponseEntity.ok(roles);
    }

    @GetMapping("/card-types")
    public ResponseEntity<List<String>> getAllCardTypes() {
        List<String> cardTypes = Arrays.stream(CardType.values())
                .map(Enum::name)
                .collect(Collectors.toList());
        return ResponseEntity.ok(cardTypes);
    }

    @GetMapping("/statuses")
    public ResponseEntity<List<String>> getAllStatuses() {
        List<String> statuses = Arrays.stream(Status.values())
                .map(Enum::name)
                .collect(Collectors.toList());
        return ResponseEntity.ok(statuses);
    }
}
