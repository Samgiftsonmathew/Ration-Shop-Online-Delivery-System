package com.example.ration_home_delivery.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "name")
    private String name;
    @Column(name = "category")
    private String category;
    @Column(name = "default_limit")
    private int defaultLimit;
    @Column(name = "image_url")
    private String imageUrl;
    @Column(name = "price")
    private  double price;

    @Column(name = "allocated_quantity", nullable = true)
    private int allocatedQuantity;

    @ManyToOne
    @JoinColumn(name = "allocation_id")
    @JsonBackReference
    private ProductAllocation allocation;

    @ManyToOne
    @JoinColumn(name = "region_id")
    @JsonBackReference
    private Region region;

}