package com.example.ration_home_delivery.Entity;

import com.example.ration_home_delivery.Enum.Status;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "sub_admin_id")
    private Long subAdminId;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "created_at")
    @CreationTimestamp
    private Date createdAt;

    @Column(name = "total_price")
    private double totalPrice;

    @Column(name = "delivery_date")
    @UpdateTimestamp
    private Date deliveryDate;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<OrderItems> items;

    @ManyToOne
    @JoinColumn(name = "region_id")
    private Region region;

    // 🔽 Razorpay Integration Fields
    @Column(name = "razorpay_order_id")
    private String razorpayOrderId;

    @Column(name = "razorpay_payment_id")
    private String razorpayPaymentId;

    @Column(name = "payment_status")
    private String paymentStatus; // e.g., CREATED, PAID, FAILED

    @Column(name = "payment_signature")
    private String paymentSignature;

}
