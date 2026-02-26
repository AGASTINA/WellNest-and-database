package com.wellnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthMetricsDto {
    private Long id;
    private Long userId;
    private Integer bloodPressureSystolic;
    private Integer bloodPressureDiastolic;
    private Integer heartRate;
    private Double bloodSugar;
    private Double cholesterolTotal;
    private Double cholesterolHDL;
    private Double cholesterolLDL;
    private Double bodyTemperature;
    private Integer oxygenSaturation;
    private Double weight;
    private Double height;
    private Double bmi;
    private Integer stepsCount;
    private Integer caloriesBurned;
    private Integer workoutDurationMinutes;
    private String notes;
    private LocalDateTime recordedAt;
    private LocalDateTime createdAt;
}
