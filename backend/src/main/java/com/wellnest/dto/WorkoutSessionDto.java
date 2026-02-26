package com.wellnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutSessionDto {
    private Long id;
    private Long userId;
    private Long workoutPlanId;
    private String workoutName;
    private String workoutType;
    private Integer durationMinutes;
    private Integer caloriesBurned;
    private LocalDateTime completedAt;
    private String notes;
    private LocalDateTime createdAt;
}
