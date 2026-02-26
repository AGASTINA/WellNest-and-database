package com.wellnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyCaloriesDto {
    private Integer totalCalories;
    private Integer targetCalories;
    private Integer remaining;
    private Double progressPercentage;
    private Integer breakfastCalories;
    private Integer lunchCalories;
    private Integer dinnerCalories;
    private Integer snackCalories;
}
