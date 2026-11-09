package com.example.ration_home_delivery.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "region")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Region {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name")
    private String name;

    // New field: each Region has a SubAdmin (User)
    @ManyToOne
    @JoinColumn(name = "sub_admin_id")
    private User subAdmin;

    @OneToMany(mappedBy = "region")
    @JsonManagedReference
    private List<User> users;
}
