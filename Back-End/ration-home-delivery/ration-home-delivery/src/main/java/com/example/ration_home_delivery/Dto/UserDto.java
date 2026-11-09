package com.example.ration_home_delivery.Dto;

import com.example.ration_home_delivery.Enum.Role;
import com.example.ration_home_delivery.Enum.CardType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private Long smartcardNo;
    private Long phone;
    private Role role;
    private CardType cardType;
    private Date createdDate;
    private String address;
    private int regionId;
    private Long subAdminId;
}
