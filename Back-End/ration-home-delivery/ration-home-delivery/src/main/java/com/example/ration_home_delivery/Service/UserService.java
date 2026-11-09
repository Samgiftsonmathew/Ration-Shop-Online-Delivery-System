package com.example.ration_home_delivery.Service;


import com.example.ration_home_delivery.Dto.UserDto;
import com.example.ration_home_delivery.Entity.User;
import com.example.ration_home_delivery.Enum.Role;
import com.example.ration_home_delivery.Repository.UserProductAllocationRepository;
import com.example.ration_home_delivery.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
     private UserProductAllocationRepository userProductAllocationRepository;

    // Create or update user
    public User saveUser(User user){
        return userRepository.save(user);
    }

    // get all users
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    // get user by id
    public Optional<User> getUserById(Long id){
        return userRepository.findById(id);
    }


    @Transactional
    public void deleteUserById(Long id) {
        var user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userProductAllocationRepository.deleteByUser(user);
        userRepository.delete(user);
    }
    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }


    public Optional<User> getUserBySmartcardNo(Long smartcardNo) {
        return userRepository.findBySmartcardNo(smartcardNo);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // get users by region id
    public List<User> getUsersByRegionId(int regionId) {
        return userRepository.findByRegionId(regionId);
    }

    public Optional<UserDto> getUserDtoBySmartcard(Long smartcardNo) {
        return userRepository.findBySmartcardNo(smartcardNo)
                .map(user -> new UserDto(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getSmartcardNo(),
                        user.getPhone(),
                        user.getRole(),
                        user.getCardType(),
                        user.getCreatedDate(),
                        user.getAddress(),
                        user.getRegion() != null ? user.getRegion().getId() : 0,
                        user.getRole() == Role.USER
                                ? (user.getRegion() != null && user.getRegion().getSubAdmin() != null
                                ? user.getRegion().getSubAdmin().getId()
                                : null)
                                : null
                ));
    }

    public Optional<UserDto> getUserDtoByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(user -> new UserDto(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getSmartcardNo(),
                        user.getPhone(),
                        user.getRole(),
                        user.getCardType(),
                        user.getCreatedDate(),
                        user.getAddress(),
                        user.getRegion() != null ? user.getRegion().getId() : 0,
                        user.getRole() == Role.USER
                                ? (user.getRegion() != null && user.getRegion().getSubAdmin() != null
                                ? user.getRegion().getSubAdmin().getId()
                                : null)
                                : null
                ));
    }

    public List<UserDto> getUserDtosByRole(Role role) {
        return userRepository.findByRole(role).stream()
                .map(user -> new UserDto(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getSmartcardNo(),
                        user.getPhone(),
                        user.getRole(),
                        user.getCardType(),
                        user.getCreatedDate(),
                        user.getAddress(),
                        user.getRegion() != null ? user.getRegion().getId() : 0,
                        user.getRole() == Role.USER
                                ? (user.getRegion() != null && user.getRegion().getSubAdmin() != null
                                ? user.getRegion().getSubAdmin().getId()
                                : null)
                                : null
                ))
                .collect(Collectors.toList());
    }


    public Optional<User> updateUser(Long id, UserDto userDto) {
        return userRepository.findById(id).map(existingUser -> {
            existingUser.setName(userDto.getName());
            existingUser.setEmail(userDto.getEmail());
            existingUser.setPhone(userDto.getPhone());
            existingUser.setRole(userDto.getRole());
            existingUser.setCardType(userDto.getCardType());
            existingUser.setSmartcardNo(userDto.getSmartcardNo());
            existingUser.setAddress(userDto.getAddress());
            // You can also update Region if needed using regionRepository.findById(userDto.getRegionId()).
            return userRepository.save(existingUser);
        });
    }





}
