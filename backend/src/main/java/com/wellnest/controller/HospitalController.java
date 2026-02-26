package com.wellnest.controller;

import com.wellnest.dto.HospitalDto;
import com.wellnest.service.HospitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed.origins}")
public class HospitalController {

    private final HospitalService hospitalService;

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<HospitalDto>> getAllHospitals() {
        List<HospitalDto> hospitals = hospitalService.getAllActiveHospitals();
        return ResponseEntity.ok(hospitals);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<HospitalDto> getHospitalById(@PathVariable Long id) {
        HospitalDto hospital = hospitalService.getHospitalById(id);
        return ResponseEntity.ok(hospital);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<HospitalDto>> searchHospitals(@RequestParam String keyword) {
        List<HospitalDto> hospitals = hospitalService.searchHospitals(keyword);
        return ResponseEntity.ok(hospitals);
    }

    @GetMapping("/nearby")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<HospitalDto>> findNearbyHospitals(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "10") Double radius) {
        List<HospitalDto> hospitals = hospitalService.findNearbyHospitals(latitude, longitude, radius);
        return ResponseEntity.ok(hospitals);
    }

    @GetMapping("/nearby/emergency")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<HospitalDto>> findNearbyEmergencyHospitals(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "10") Double radius) {
        List<HospitalDto> hospitals = hospitalService.findNearbyEmergencyHospitals(
                latitude, longitude, radius);
        return ResponseEntity.ok(hospitals);
    }
}
