    package com.example.ration_home_delivery.Entity;

    import com.fasterxml.jackson.annotation.JsonBackReference;
    import jakarta.persistence.*;
    import lombok.Data;

    @Entity
    @Data
    @Table(name = "order_items")
    public class OrderItems {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JsonBackReference
        @JoinColumn(name = "order_id")
        private Order order;

        @Column(name = "product_id")
        private Long productId;

        @Column(name = "product_name")
        private String productName;

        private int quantity;
        private double price;
    }
