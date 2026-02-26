package com.wellnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseDto {
    private Long id;
    private String name;
    private String type;
    private String notes;
    private String imageUrl;
    private Integer exerciseOrder;
    private List<WorkoutSetDto> sets;
    private Integer restSeconds;
    private String instructions;
}
