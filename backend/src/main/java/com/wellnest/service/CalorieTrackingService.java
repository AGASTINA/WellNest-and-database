package com.wellnest.service;

import com.wellnest.dto.CalorieSummaryDto;
import com.wellnest.entity.Meal;
import com.wellnest.entity.WorkoutSession;
import com.wellnest.repository.MealRepository;
import com.wellnest.repository.WorkoutSessionRepository;
import com.wellnest.repository.FitnessGoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CalorieTrackingService {

    private final MealRepository mealRepository;
    private final WorkoutSessionRepository workoutSessionRepository;
    private final FitnessGoalRepository fitnessGoalRepository;

    public CalorieSummaryDto getCalorieSummary(Long userId, LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
        
        // Get meals for the day
        List<Meal> meals = mealRepository.findByUserIdAndDateRange(userId, startOfDay, endOfDay);
        
        // Get workouts for the day
        List<WorkoutSession> workouts = workoutSessionRepository.findByUserIdAndCompletedAtBetween(
            userId, startOfDay, endOfDay
        );
        
        // Calculate consumed calories
        int caloriesConsumed = meals.stream().mapToInt(Meal::getCalories).sum();
        
        // Calculate burned calories
        int caloriesBurned = workouts.stream().mapToInt(WorkoutSession::getCaloriesBurned).sum();
        
        // Net calories (consumed - burned)
        int netCalories = caloriesConsumed - caloriesBurned;
        
        // Get target from active fitness goals (default 2000)
        int targetCalories = fitnessGoalRepository
            .findActiveGoalsByUserId(userId)
            .stream()
            .filter(goal -> goal.getTargetCalories() != null)
            .findFirst()
            .map(goal -> goal.getTargetCalories())
            .orElse(2000);
        
        int remainingCalories = targetCalories - netCalories;
        double progressPercentage = netCalories > 0 ? (netCalories * 100.0) / targetCalories : 0;
        
        // Breakdown by meal type
        Map<String, Integer> consumedByMealType = new HashMap<>();
        consumedByMealType.put("BREAKFAST", meals.stream()
            .filter(m -> "BREAKFAST".equals(m.getMealType()))
            .mapToInt(Meal::getCalories).sum());
        consumedByMealType.put("LUNCH", meals.stream()
            .filter(m -> "LUNCH".equals(m.getMealType()))
            .mapToInt(Meal::getCalories).sum());
        consumedByMealType.put("DINNER", meals.stream()
            .filter(m -> "DINNER".equals(m.getMealType()))
            .mapToInt(Meal::getCalories).sum());
        consumedByMealType.put("SNACK", meals.stream()
            .filter(m -> "SNACK".equals(m.getMealType()))
            .mapToInt(Meal::getCalories).sum());
        
        // Breakdown by workout type
        Map<String, Integer> burnedByWorkoutType = new HashMap<>();
        workouts.forEach(w -> {
            String type = w.getWorkoutType() != null ? w.getWorkoutType() : "General";
            int calories = w.getCaloriesBurned() != null ? w.getCaloriesBurned() : 0;
            burnedByWorkoutType.merge(type, calories, (a, b) -> a + b);
        });
        
        // Calculate macros (converting from Double to int)
        int totalProtein = (int) meals.stream()
            .mapToDouble(m -> m.getProteinGrams() != null ? m.getProteinGrams() : 0.0)
            .sum();
        int totalCarbs = (int) meals.stream()
            .mapToDouble(m -> m.getCarbsGrams() != null ? m.getCarbsGrams() : 0.0)
            .sum();
        int totalFat = (int) meals.stream()
            .mapToDouble(m -> m.getFatGrams() != null ? m.getFatGrams() : 0.0)
            .sum();
        int workoutMinutes = workouts.stream().mapToInt(WorkoutSession::getDurationMinutes).sum();
        
        CalorieSummaryDto summary = new CalorieSummaryDto();
        summary.setDate(date);
        summary.setCaloriesConsumed(caloriesConsumed);
        summary.setCaloriesBurned(caloriesBurned);
        summary.setNetCalories(netCalories);
        summary.setTargetCalories(targetCalories);
        summary.setRemainingCalories(remainingCalories);
        summary.setProgressPercentage(progressPercentage);
        summary.setConsumedByMealType(consumedByMealType);
        summary.setBurnedByWorkoutType(burnedByWorkoutType);
        summary.setTotalProtein(totalProtein);
        summary.setTotalCarbs(totalCarbs);
        summary.setTotalFat(totalFat);
        summary.setWorkoutMinutes(workoutMinutes);
        
        return summary;
    }
}
