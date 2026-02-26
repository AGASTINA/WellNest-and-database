package com.wellnest.controller;

import com.wellnest.dto.MedicalRecordDto;
import com.wellnest.dto.MessageResponse;
import com.wellnest.service.MedicalRecordService;
import com.wellnest.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed.origins}")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;
    private final UserService userService;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<MedicalRecordDto> createMedicalRecord(@RequestBody MedicalRecordDto dto) {
        Long userId = getCurrentUserId();
        MedicalRecordDto created = medicalRecordService.createMedicalRecord(userId, dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<MedicalRecordDto>> getUserMedicalRecords() {
        Long userId = getCurrentUserId();
        List<MedicalRecordDto> records = medicalRecordService.getUserMedicalRecords(userId);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/type/{recordType}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<MedicalRecordDto>> getUserMedicalRecordsByType(@PathVariable String recordType) {
        Long userId = getCurrentUserId();
        List<MedicalRecordDto> records = medicalRecordService.getUserMedicalRecordsByType(userId, recordType);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<MedicalRecordDto> getMedicalRecordById(@PathVariable Long id) {
        MedicalRecordDto record = medicalRecordService.getMedicalRecordById(id);
        return ResponseEntity.ok(record);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<MedicalRecordDto> updateMedicalRecord(
            @PathVariable Long id,
            @RequestBody MedicalRecordDto dto) {
        MedicalRecordDto updated = medicalRecordService.updateMedicalRecord(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<MessageResponse> deleteMedicalRecord(@PathVariable Long id) {
        medicalRecordService.deleteMedicalRecord(id);
        return ResponseEntity.ok(new MessageResponse("Medical record deleted successfully"));
    }

    private Long getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userService.getUserProfile(email).getId();
    }
}
