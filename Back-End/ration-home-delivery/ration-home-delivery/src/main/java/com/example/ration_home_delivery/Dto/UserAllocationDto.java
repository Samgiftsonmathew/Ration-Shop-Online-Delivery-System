package com.example.ration_home_delivery.Dto;

import lombok.Data;
import java.util.List;

@Data
public class UserAllocationDto {
    private Long userId;
    private String userName;
    private List<ProductAllocationItemDto> allocations;
}
