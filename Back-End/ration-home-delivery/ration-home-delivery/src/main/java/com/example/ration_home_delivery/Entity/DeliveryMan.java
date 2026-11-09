package com.example.ration_home_delivery.Entity;

import com.example.ration_home_delivery.Enum.Status;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "delivery_man")
public class DeliveryMan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "aadhar_num")
    private Long aadharNum;

    @Column(name = "name")
    private String name;

    @Column(name = "phone_no")
    private Long phoneNO;

    @ManyToOne
    @JoinColumn(name = "region_id")
    @JsonBackReference
    private Region region;
}
