package com.example.ration_home_delivery.Controller;

import com.example.ration_home_delivery.Dto.ProductAllocationItemDto;
import com.example.ration_home_delivery.Dto.UserAllocationDto;
import com.example.ration_home_delivery.Dto.UserDto;
import com.example.ration_home_delivery.Entity.Region;
import com.example.ration_home_delivery.Entity.User;
import com.example.ration_home_delivery.Entity.UserProductAllocation;
import com.example.ration_home_delivery.Repository.UserProductAllocationRepository;
import com.example.ration_home_delivery.Enum.Role;
import com.example.ration_home_delivery.Repository.RegionRepository;
import com.example.ration_home_delivery.Repository.UserRepository;
import com.example.ration_home_delivery.Service.AllocationService;
import com.example.ration_home_delivery.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;
    private final RegionRepository regionRepository;

    @Autowired
    private AllocationService allocationService;


    @Autowired
    private UserService userService;

    @Autowired
    private UserProductAllocationRepository userProductAllocationRepository;

    @Autowired
    public UserController(UserRepository userRepository, RegionRepository regionRepository, UserService userService) {
        this.userRepository = userRepository;
        this.regionRepository = regionRepository;
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/role/{role}")
    public List<UserDto> getUsersByRole(@PathVariable Role role) {
        return userService.getUserDtosByRole(role);
    }

    @PostMapping
    public User createUser(@RequestBody UserDto userDto) {
        User user = new User();
        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setSmartcardNo(userDto.getSmartcardNo());
        user.setPhone(userDto.getPhone());
        user.setRole(userDto.getRole());
        user.setCardType(userDto.getCardType());
        user.setAddress(userDto.getAddress());

        // If you have regionId in the DTO, you can also fetch and set the Region:
        Region region = regionRepository.findById(userDto.getRegionId())
                .orElseThrow(() -> new RuntimeException("Region not found"));
        user.setRegion(region);

        User savedUser = userRepository.save(user);

        // Automatically initialize allocations
        allocationService.initializeUserAllocation(savedUser);

        return savedUser;
    }


    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
    }

    @GetMapping("/region/{regionId}")
    public List<User> getUserByRegion(@PathVariable int regionId) {
        return userService.getUsersByRegionId(regionId);
    }

    // NEW ENDPOINT: group by region, sort by role
    @GetMapping("/grouped")
    public Map<String, List<User>> getUsersGroupedByRegionSortedByRole(@RequestParam(required = false) String role) {
        List<User> allUsers = userRepository.findAll();

        // filter by role if provided
        if (role != null && !role.isEmpty()) {
            allUsers = allUsers.stream()
                    .filter(user -> user.getRole().toString().equalsIgnoreCase(role))
                    .collect(Collectors.toList());
        }

        // group by region name, sort each group by role
        return allUsers.stream()
                .collect(Collectors.groupingBy(
                        user -> user.getRegion().getName(),
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> {
                                    list.sort(Comparator.comparing(User::getRole));
                                    return list;
                                }
                        )
                ));
    }

    @GetMapping("/smartcard/{smartcardNo}")
    public ResponseEntity<?> loginUserBySmartcard(@PathVariable Long smartcardNo) {
        return userService.getUserDtoBySmartcard(smartcardNo)
                .map(userDto -> {
                    if (userDto.getRole() != Role.USER) {
                        return ResponseEntity.badRequest().body("Only user can login with smartcard.");
                    }
                    return ResponseEntity.ok(userDto);
                })
                .orElse(ResponseEntity.status(404).body("User not found with this smartcard."));
    }


    @GetMapping("/email/{email}")
    public ResponseEntity<?> loginSubAdminByEmail(@PathVariable String email) {
        return userService.getUserDtoByEmail(email)
                .map(userDto -> {
                    if (userDto.getRole() != Role.SUBADMIN) {
                        return ResponseEntity.badRequest().body("Only subadmin can login with email.");
                    }
                    return ResponseEntity.ok(userDto);
                })
                .orElse(ResponseEntity.status(404).body("User not found with this email."));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {
        return userService.updateUser(id, userDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}/allocations")
    public ResponseEntity<UserAllocationDto> getUserAllocations(@PathVariable Long userId) {
        UserAllocationDto userDto = allocationService.getUserAllocations(userId);
        return ResponseEntity.ok(userDto);
    }

}
