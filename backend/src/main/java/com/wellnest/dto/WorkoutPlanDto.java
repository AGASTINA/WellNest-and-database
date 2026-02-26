package com.wellnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutPlanDto {
    private Long id;
    private String name;
    private String description;
    private Integer durationMinutes;
    private List<ExerciseDto> exercises;
    private Boolean isActive;
    private Integer completedCount;
    private LocalDateTime lastCompletedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
