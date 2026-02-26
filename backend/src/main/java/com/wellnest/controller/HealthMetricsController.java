package com.wellnest.controller;

import com.wellnest.dto.HealthMetricsDto;
import com.wellnest.service.HealthMetricsService;
import com.wellnest.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/health-metrics")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed.origins}")
public class HealthMetricsController {

    private final HealthMetricsService healthMetricsService;
    private final UserService userService;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<HealthMetricsDto> recordHealthMetrics(@RequestBody HealthMetricsDto dto) {
        Long userId = getCurrentUserId();
        HealthMetricsDto recorded = healthMetricsService.recordHealthMetrics(userId, dto);
        return ResponseEntity.ok(recorded);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<HealthMetricsDto>> getUserHealthMetrics() {
        Long userId = getCurrentUserId();
        List<HealthMetricsDto> metrics = healthMetricsService.getUserHealthMetrics(userId);
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/latest")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<HealthMetricsDto> getLatestHealthMetrics() {
        Long userId = getCurrentUserId();
        HealthMetricsDto latest = healthMetricsService.getLatestHealthMetrics(userId);
        return ResponseEntity.ok(latest);
    }

    @GetMapping("/range")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<HealthMetricsDto>> getHealthMetricsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        Long userId = getCurrentUserId();
        List<HealthMetricsDto> metrics = healthMetricsService.getUserHealthMetricsByDateRange(userId, start, end);
        return ResponseEntity.ok(metrics);
    }

    private Long getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userService.getUserProfile(email).getId();
    }
}
