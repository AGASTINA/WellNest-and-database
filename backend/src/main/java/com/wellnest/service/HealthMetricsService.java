package com.wellnest.service;

import com.wellnest.dto.HealthMetricsDto;
import com.wellnest.entity.HealthMetrics;
import com.wellnest.entity.User;
import com.wellnest.repository.HealthMetricsRepository;
import com.wellnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HealthMetricsService {

    private final HealthMetricsRepository healthMetricsRepository;
    private final UserRepository userRepository;

    @Transactional    @SuppressWarnings("null")    public HealthMetricsDto recordHealthMetrics(Long userId, HealthMetricsDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        HealthMetrics metrics = new HealthMetrics();
        metrics.setUser(user);
        metrics.setBloodPressureSystolic(dto.getBloodPressureSystolic());
        metrics.setBloodPressureDiastolic(dto.getBloodPressureDiastolic());
        metrics.setHeartRate(dto.getHeartRate());
        metrics.setBloodSugar(dto.getBloodSugar());
        metrics.setCholesterolTotal(dto.getCholesterolTotal());
        metrics.setCholesterolHDL(dto.getCholesterolHDL());
        metrics.setCholesterolLDL(dto.getCholesterolLDL());
        metrics.setBodyTemperature(dto.getBodyTemperature());
        metrics.setOxygenSaturation(dto.getOxygenSaturation());
        metrics.setWeight(dto.getWeight());
        metrics.setHeight(dto.getHeight());
        metrics.setStepsCount(dto.getStepsCount());
        metrics.setCaloriesBurned(dto.getCaloriesBurned());
        metrics.setWorkoutDurationMinutes(dto.getWorkoutDurationMinutes());
        metrics.setNotes(dto.getNotes());
        metrics.setRecordedAt(dto.getRecordedAt() != null ? dto.getRecordedAt() : LocalDateTime.now());

        HealthMetrics saved = healthMetricsRepository.save(metrics);
        return convertToDto(saved);
    }

    public List<HealthMetricsDto> getUserHealthMetrics(Long userId) {
        return healthMetricsRepository.findByUserIdOrderByRecordedAtDesc(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<HealthMetricsDto> getUserHealthMetricsByDateRange(Long userId, LocalDateTime start, LocalDateTime end) {
        return healthMetricsRepository.findByUserIdAndRecordedAtBetween(userId, start, end)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public HealthMetricsDto getLatestHealthMetrics(Long userId) {
        List<HealthMetrics> metrics = healthMetricsRepository.findByUserIdOrderByRecordedAtDesc(userId);
        if (metrics.isEmpty()) {
            return null;
        }
        return convertToDto(metrics.get(0));
    }

    private HealthMetricsDto convertToDto(HealthMetrics metrics) {
        HealthMetricsDto dto = new HealthMetricsDto();
        dto.setId(metrics.getId());
        dto.setUserId(metrics.getUser().getId());
        dto.setBloodPressureSystolic(metrics.getBloodPressureSystolic());
        dto.setBloodPressureDiastolic(metrics.getBloodPressureDiastolic());
        dto.setHeartRate(metrics.getHeartRate());
        dto.setBloodSugar(metrics.getBloodSugar());
        dto.setCholesterolTotal(metrics.getCholesterolTotal());
        dto.setCholesterolHDL(metrics.getCholesterolHDL());
        dto.setCholesterolLDL(metrics.getCholesterolLDL());
        dto.setBodyTemperature(metrics.getBodyTemperature());
        dto.setOxygenSaturation(metrics.getOxygenSaturation());
        dto.setWeight(metrics.getWeight());
        dto.setHeight(metrics.getHeight());
        dto.setBmi(metrics.getBmi());
        dto.setStepsCount(metrics.getStepsCount());
        dto.setCaloriesBurned(metrics.getCaloriesBurned());
        dto.setWorkoutDurationMinutes(metrics.getWorkoutDurationMinutes());
        dto.setNotes(metrics.getNotes());
        dto.setRecordedAt(metrics.getRecordedAt());
        dto.setCreatedAt(metrics.getCreatedAt());
        return dto;
    }
}
