package com.wellnest.repository;

import com.wellnest.entity.WorkoutSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, Long> {
    
    List<WorkoutSession> findByUserIdOrderByCompletedAtDesc(Long userId);
    
    List<WorkoutSession> findByUserIdAndCompletedAtBetween(
        Long userId, 
        LocalDateTime startDate, 
        LocalDateTime endDate
    );
    
    @Query("SELECT COALESCE(SUM(ws.caloriesBurned), 0) FROM WorkoutSession ws " +
           "WHERE ws.user.id = :userId " +
           "AND ws.completedAt >= :startDate " +
           "AND ws.completedAt < :endDate")
    Integer getTotalCaloriesBurnedByUserAndDate(Long userId, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT ws.workoutType, SUM(ws.caloriesBurned) FROM WorkoutSession ws " +
           "WHERE ws.user.id = :userId " +
           "AND ws.completedAt >= :startDate " +
           "AND ws.completedAt < :endDate " +
           "GROUP BY ws.workoutType")
    List<Object[]> getCaloriesByWorkoutType(Long userId, LocalDateTime startDate, LocalDateTime endDate);
}
