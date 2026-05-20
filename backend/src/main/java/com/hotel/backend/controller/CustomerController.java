package com.hotel.backend.controller;

import com.hotel.backend.model.Customer;
import com.hotel.backend.repository.CustomerRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerRepository customerRepository;

    public CustomerController(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @PostMapping
    public Customer createCustomer(@Valid @RequestBody Customer customer) {
        return customerRepository.save(customer);
    }
}
