package com.wellnest.controller;

import com.wellnest.dto.ConsultationDto;
import com.wellnest.dto.ConsultationRequest;
import com.wellnest.service.ConsultationService;
import com.wellnest.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultations")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed.origins}")
public class ConsultationController {

    private final ConsultationService consultationService;
    private final UserService userService;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ConsultationDto> bookConsultation(@RequestBody ConsultationRequest request) {
        Long userId = getCurrentUserId();
        ConsultationDto consultation = consultationService.bookConsultation(userId, request);
        return ResponseEntity.ok(consultation);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<ConsultationDto>> getUserConsultations() {
        Long userId = getCurrentUserId();
        List<ConsultationDto> consultations = consultationService.getUserConsultations(userId);
        return ResponseEntity.ok(consultations);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<ConsultationDto>> getUserConsultationsByStatus(@PathVariable String status) {
        Long userId = getCurrentUserId();
        List<ConsultationDto> consultations = consultationService.getUserConsultationsByStatus(userId, status);
        return ResponseEntity.ok(consultations);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ConsultationDto> getConsultationById(@PathVariable Long id) {
        ConsultationDto consultation = consultationService.getConsultationById(id);
        return ResponseEntity.ok(consultation);
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ConsultationDto> cancelConsultation(@PathVariable Long id) {
        ConsultationDto consultation = consultationService.cancelConsultation(id);
        return ResponseEntity.ok(consultation);
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ConsultationDto> completeConsultation(
            @PathVariable Long id,
            @RequestParam String diagnosis,
            @RequestParam String prescription) {
        ConsultationDto consultation = consultationService.completeConsultation(id, diagnosis, prescription);
        return ResponseEntity.ok(consultation);
    }

    private Long getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userService.getUserProfile(email).getId();
    }
}
