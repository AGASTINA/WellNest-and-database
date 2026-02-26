package com.wellnest.repository;

import com.wellnest.entity.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MealRepository extends JpaRepository<Meal, Long> {
    
    List<Meal> findByUserIdOrderByMealDateDesc(Long userId);
    
    List<Meal> findByUserIdAndMealType(Long userId, String mealType);
    
    @Query("SELECT m FROM Meal m WHERE m.user.id = ?1 AND m.mealDate BETWEEN ?2 AND ?3 ORDER BY m.mealDate DESC")
    List<Meal> findByUserIdAndDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT SUM(m.calories) FROM Meal m WHERE m.user.id = ?1 AND DATE(m.mealDate) = DATE(?2)")
    Integer getTotalCaloriesByUserAndDate(Long userId, LocalDateTime date);
    
    @Query("SELECT m FROM Meal m WHERE m.user.id = ?1 AND m.mealName = ?2 AND m.mealDate = ?3")
    List<Meal> findDuplicateMeals(Long userId, String mealName, LocalDateTime mealDate);
}
