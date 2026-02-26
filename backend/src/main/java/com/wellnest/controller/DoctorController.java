package com.wellnest.controller;

import com.wellnest.dto.DoctorDto;
import com.wellnest.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed.origins}")
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<DoctorDto>> getAllDoctors() {
        List<DoctorDto> doctors = doctorService.getAllAvailableDoctors();
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<DoctorDto> getDoctorById(@PathVariable Long id) {
        DoctorDto doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(doctor);
    }

    @GetMapping("/specialization/{specialization}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<DoctorDto>> getDoctorsBySpecialization(@PathVariable String specialization) {
        List<DoctorDto> doctors = doctorService.getDoctorsBySpecialization(specialization);
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<DoctorDto>> searchDoctors(@RequestParam String keyword) {
        List<DoctorDto> doctors = doctorService.searchDoctors(keyword);
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/nearby")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<DoctorDto>> findNearbyDoctors(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "10") Double radius) {
        List<DoctorDto> doctors = doctorService.findNearbyDoctors(latitude, longitude, radius);
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/nearby/specialization")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<DoctorDto>> findNearbyDoctorsBySpecialization(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "10") Double radius,
            @RequestParam String specialization) {
        List<DoctorDto> doctors = doctorService.findNearbyDoctorsBySpecialization(
                latitude, longitude, radius, specialization);
        return ResponseEntity.ok(doctors);
    }
}
