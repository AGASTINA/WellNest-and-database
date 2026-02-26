package com.wellnest.controller;

import com.wellnest.constants.IndianCuisineConstants;
import com.wellnest.dto.CalorieSummaryDto;
import com.wellnest.dto.DailyCaloriesDto;
import com.wellnest.dto.MealDto;
import com.wellnest.service.CalorieTrackingService;
import com.wellnest.service.MealService;
import com.wellnest.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/meals")
@RequiredArgsConstructor
public class MealController {

    private final MealService mealService;
    private final UserService userService;
    private final CalorieTrackingService calorieTrackingService;

    @PostMapping
    @SuppressWarnings("null")
    public ResponseEntity<?> createMeal(@RequestBody MealDto mealDto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserProfile(email).getId();
        
        try {
            MealDto created = mealService.createMeal(userId, mealDto);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Duplicate")) {
                return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            }
            throw e;
        }
    }

    @GetMapping
    @SuppressWarnings("null")
    public ResponseEntity<List<MealDto>> getUserMeals() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserProfile(email).getId();
        
        List<MealDto> meals = mealService.getUserMeals(userId);
        return ResponseEntity.ok(meals);
    }

    @GetMapping("/date-range")
    @SuppressWarnings("null")
    public ResponseEntity<List<MealDto>> getMealsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserProfile(email).getId();
        
        List<MealDto> meals = mealService.getMealsByDateRange(userId, startDate, endDate);
        return ResponseEntity.ok(meals);
    }

    @GetMapping("/daily-calories")
    @SuppressWarnings("null")
    public ResponseEntity<DailyCaloriesDto> getDailyCalories(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserProfile(email).getId();
        
        DailyCaloriesDto dailyCalories = mealService.getDailyCalories(userId, date);
        return ResponseEntity.ok(dailyCalories);
    }

    @GetMapping("/calorie-summary")
    @SuppressWarnings("null")
    public ResponseEntity<CalorieSummaryDto> getCalorieSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserProfile(email).getId();
        
        LocalDate queryDate = date != null ? date : LocalDate.now();
        CalorieSummaryDto summary = calorieTrackingService.getCalorieSummary(userId, queryDate);
        return ResponseEntity.ok(summary);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeal(@PathVariable Long id) {
        mealService.deleteMeal(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/indian-cuisine/templates")
    public ResponseEntity<Map<String, IndianCuisineConstants.MealTemplate>> getIndianCuisineTemplates() {
        Map<String, IndianCuisineConstants.MealTemplate> templates = IndianCuisineConstants.getAllMeals();
        return ResponseEntity.ok(templates);
    }

    @GetMapping("/indian-cuisine/north-indian")
    public ResponseEntity<Map<String, IndianCuisineConstants.MealTemplate>> getNorthIndianMeals() {
        return ResponseEntity.ok(IndianCuisineConstants.NORTH_INDIAN_MEALS);
    }

    @GetMapping("/indian-cuisine/south-indian")
    public ResponseEntity<Map<String, IndianCuisineConstants.MealTemplate>> getSouthIndianMeals() {
        return ResponseEntity.ok(IndianCuisineConstants.SOUTH_INDIAN_MEALS);
    }

    @GetMapping("/indian-cuisine/vegetarian")
    public ResponseEntity<Map<String, IndianCuisineConstants.MealTemplate>> getVegetarianMeals() {
        return ResponseEntity.ok(IndianCuisineConstants.VEGETARIAN_MEALS);
    }

    @GetMapping("/indian-cuisine/breakfast")
    public ResponseEntity<Map<String, IndianCuisineConstants.MealTemplate>> getBreakfastItems() {
        return ResponseEntity.ok(IndianCuisineConstants.BREAKFAST_ITEMS);
    }

    @GetMapping("/indian-cuisine/snacks")
    public ResponseEntity<Map<String, IndianCuisineConstants.MealTemplate>> getSnacks() {
        return ResponseEntity.ok(IndianCuisineConstants.SNACKS);
    }
}
