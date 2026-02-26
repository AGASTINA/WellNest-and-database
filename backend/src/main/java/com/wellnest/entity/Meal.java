package com.wellnest.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "meals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "meal_type", nullable = false)
    private String mealType; // BREAKFAST, LUNCH, DINNER, SNACK

    @Column(name = "meal_name", nullable = false)
    private String mealName;

    @Column(name = "cuisine_type")
    private String cuisineType; // INDIAN, WESTERN, CHINESE, CONTINENTAL, etc.

    @Column(nullable = false)
    private Integer calories;

    @Column(name = "protein_grams")
    private Double proteinGrams;

    @Column(name = "carbs_grams")
    private Double carbsGrams;

    @Column(name = "fat_grams")
    private Double fatGrams;

    @Column(name = "fiber_grams")
    private Double fiberGrams;

    @Column(columnDefinition = "TEXT")
    private String ingredients;

    @Column(name = "portion_size")
    private String portionSize;

    @Column(name = "is_vegetarian")
    private Boolean isVegetarian;

    @Column(name = "is_vegan")
    private Boolean isVegan;

    @Column(name = "meal_date", nullable = false)
    private LocalDateTime mealDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (isVegetarian == null) {
            isVegetarian = false;
        }
        if (isVegan == null) {
            isVegan = false;
        }
    }
}
