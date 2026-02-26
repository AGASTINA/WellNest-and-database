package com.wellnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CalorieSummaryDto {
    private LocalDate date;
    private Integer caloriesConsumed;
    private Integer caloriesBurned;
    private Integer netCalories;
    private Integer targetCalories;
    private Integer remainingCalories;
    private Double progressPercentage;
    
    // Breakdown by meal type
    private Map<String, Integer> consumedByMealType;
    
    // Breakdown by workout type
    private Map<String, Integer> burnedByWorkoutType;
    
    // Additional metrics
    private Integer totalProtein;
    private Integer totalCarbs;
    private Integer totalFat;
    private Integer workoutMinutes;
}
