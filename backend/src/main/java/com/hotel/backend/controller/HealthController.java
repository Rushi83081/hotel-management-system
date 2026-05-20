package com.hotel.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/api/hello")
    public String hello() {
        return "Hotel Management Backend is running";
    }
}
