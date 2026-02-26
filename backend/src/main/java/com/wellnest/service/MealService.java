package com.wellnest.service;

import com.wellnest.dto.DailyCaloriesDto;
import com.wellnest.dto.MealDto;
import com.wellnest.entity.Meal;
import com.wellnest.entity.User;
import com.wellnest.repository.MealRepository;
import com.wellnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MealService {

    private final MealRepository mealRepository;
    private final UserRepository userRepository;

    @Transactional
    @SuppressWarnings("null")
    public MealDto createMeal(Long userId, MealDto mealDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check for duplicate meals
        List<Meal> duplicates = mealRepository.findDuplicateMeals(
            userId, mealDto.getMealName(), mealDto.getMealDate()
        );
        
        if (!duplicates.isEmpty()) {
            throw new RuntimeException("Duplicate meal record found for same name and date");
        }

        Meal meal = new Meal();
        meal.setUser(user);
        meal.setMealType(mealDto.getMealType());
        meal.setMealName(mealDto.getMealName());
        meal.setCuisineType(mealDto.getCuisineType());
        meal.setCalories(mealDto.getCalories());
        meal.setProteinGrams(mealDto.getProteinGrams());
        meal.setCarbsGrams(mealDto.getCarbsGrams());
        meal.setFatGrams(mealDto.getFatGrams());
        meal.setFiberGrams(mealDto.getFiberGrams());
        meal.setIngredients(mealDto.getIngredients());
        meal.setPortionSize(mealDto.getPortionSize());
        meal.setIsVegetarian(mealDto.getIsVegetarian());
        meal.setIsVegan(mealDto.getIsVegan());
        meal.setMealDate(mealDto.getMealDate() != null ? mealDto.getMealDate() : LocalDateTime.now());
        meal.setNotes(mealDto.getNotes());

        Meal saved = mealRepository.save(meal);
        return convertToDto(saved);
    }

    public List<MealDto> getUserMeals(Long userId) {
        return mealRepository.findByUserIdOrderByMealDateDesc(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<MealDto> getMealsByDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        return mealRepository.findByUserIdAndDateRange(userId, startDate, endDate)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public DailyCaloriesDto getDailyCalories(Long userId, LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
        
        List<Meal> meals = mealRepository.findByUserIdAndDateRange(userId, startOfDay, endOfDay);
        
        int totalCalories = meals.stream().mapToInt(Meal::getCalories).sum();
        int breakfastCalories = meals.stream()
                .filter(m -> "BREAKFAST".equals(m.getMealType()))
                .mapToInt(Meal::getCalories).sum();
        int lunchCalories = meals.stream()
                .filter(m -> "LUNCH".equals(m.getMealType()))
                .mapToInt(Meal::getCalories).sum();
        int dinnerCalories = meals.stream()
                .filter(m -> "DINNER".equals(m.getMealType()))
                .mapToInt(Meal::getCalories).sum();
        int snackCalories = meals.stream()
                .filter(m -> "SNACK".equals(m.getMealType()))
                .mapToInt(Meal::getCalories).sum();

        // Default target is 2000 calories (can be fetched from user's fitness goal)
        int targetCalories = 2000;
        int remaining = targetCalories - totalCalories;
        double progressPercentage = (totalCalories * 100.0) / targetCalories;

        return new DailyCaloriesDto(
            totalCalories, targetCalories, remaining, progressPercentage,
            breakfastCalories, lunchCalories, dinnerCalories, snackCalories
        );
    }

    @Transactional
    @SuppressWarnings("null")
    public void deleteMeal(Long id) {
        mealRepository.deleteById(id);
    }

    private MealDto convertToDto(Meal meal) {
        MealDto dto = new MealDto();
        dto.setId(meal.getId());
        dto.setUserId(meal.getUser().getId());
        dto.setMealType(meal.getMealType());
        dto.setMealName(meal.getMealName());
        dto.setCuisineType(meal.getCuisineType());
        dto.setCalories(meal.getCalories());
        dto.setProteinGrams(meal.getProteinGrams());
        dto.setCarbsGrams(meal.getCarbsGrams());
        dto.setFatGrams(meal.getFatGrams());
        dto.setFiberGrams(meal.getFiberGrams());
        dto.setIngredients(meal.getIngredients());
        dto.setPortionSize(meal.getPortionSize());
        dto.setIsVegetarian(meal.getIsVegetarian());
        dto.setIsVegan(meal.getIsVegan());
        dto.setMealDate(meal.getMealDate());
        dto.setNotes(meal.getNotes());
        dto.setCreatedAt(meal.getCreatedAt());
        return dto;
    }
}
