package com.wellnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FitnessGoalDto {
    private Long id;
    private Long userId;
    private String goalType;
    private Double targetWeight;
    private Integer targetCalories;
    private Integer targetSteps;
    private Integer targetWorkoutMinutes;
    private LocalDateTime startDate;
    private LocalDateTime targetDate;
    private String status;
    private Double progressPercentage;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
