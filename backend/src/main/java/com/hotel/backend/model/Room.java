package com.hotel.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

@Entity
@Data
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String roomNumber;

    @NotBlank
    private String roomType;

    @NotNull
    private Double pricePerNight;

    @NotBlank
    private String status;
}
