package com.wellnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutSetDto {
    private Long id;
    private Integer setNumber;
    private Integer reps;
    private Double weight;
    private String weightUnit;
    private String notes;
    private Boolean isCompleted;
    private Integer actualReps;
    private Double actualWeight;
}
