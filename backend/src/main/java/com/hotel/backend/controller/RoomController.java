package com.hotel.backend.controller;

import com.hotel.backend.model.Room;
import com.hotel.backend.repository.RoomRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @GetMapping
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @PostMapping
    public Room createRoom(@Valid @RequestBody Room room) {
        return roomRepository.save(room);
    }
}
