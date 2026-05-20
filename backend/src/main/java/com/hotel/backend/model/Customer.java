package com.hotel.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

@Entity
@Data
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String fullName;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String phone;

    private String address;
}
