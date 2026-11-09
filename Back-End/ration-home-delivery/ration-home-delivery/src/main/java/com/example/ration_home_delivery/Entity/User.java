package com.example.ration_home_delivery.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.example.ration_home_delivery.Enum.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private  String name;

    @Column(name = "email")
    private  String email;

    @Column(name="smartcard_no",unique = true,nullable = true)
    private Long smartcardNo;

    @Column(name="phone")
    private long phone;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Role role;


    @Column(name = "card_type", nullable = true)
    @Enumerated(EnumType.STRING)
    private CardType cardType;


    @CreationTimestamp
    private Date createdDate;

    @Column(name = "address")
    private String address;

    @ManyToOne
    @JoinColumn(name = "region_id")
    @JsonBackReference
    private Region region;









}
