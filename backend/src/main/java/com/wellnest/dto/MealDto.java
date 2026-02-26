package com.wellnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MealDto {
    private Long id;
    private Long userId;
    private String mealType;
    private String mealName;
    private String cuisineType;
    private Integer calories;
    private Double proteinGrams;
    private Double carbsGrams;
    private Double fatGrams;
    private Double fiberGrams;
    private String ingredients;
    private String portionSize;
    private Boolean isVegetarian;
    private Boolean isVegan;
    private LocalDateTime mealDate;
    private String notes;
    private LocalDateTime createdAt;
}
