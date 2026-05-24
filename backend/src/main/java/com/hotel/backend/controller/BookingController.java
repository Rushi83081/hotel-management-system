package com.hotel.backend.controller;

import com.hotel.backend.model.Booking;
import com.hotel.backend.model.Customer;
import com.hotel.backend.model.Room;
import com.hotel.backend.repository.BookingRepository;
import com.hotel.backend.repository.CustomerRepository;
import com.hotel.backend.repository.RoomRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin("*")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final RoomRepository roomRepository;

    public BookingController(
            BookingRepository bookingRepository,
            CustomerRepository customerRepository,
            RoomRepository roomRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
        this.roomRepository = roomRepository;
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @PostMapping
    public Booking createBooking(@Valid @RequestBody Booking booking) {

        Room room = roomRepository.findById(
                booking.getRoom().getId()
        ).orElseThrow();

        Customer customer = customerRepository.findById(
                booking.getCustomer().getId()
        ).orElseThrow();

        if (room.getStatus().equals("OCCUPIED")) {
            throw new RuntimeException("Room already occupied");
        }
List<Booking> existingBookings =
        bookingRepository.findAll();

for (Booking existing : existingBookings) {

    boolean sameRoom =
            existing.getRoom().getId().equals(room.getId());

    boolean overlap =
            booking.getCheckInDate().isBefore(existing.getCheckOutDate())
            &&
            booking.getCheckOutDate().isAfter(existing.getCheckInDate());

    if (sameRoom && overlap) {
        throw new RuntimeException(
                "Room already booked for selected dates"
        );
    }
}
        room.setStatus("OCCUPIED");
        roomRepository.save(room);

        booking.setRoom(room);
        booking.setCustomer(customer);

        return bookingRepository.save(booking);
    }
}
