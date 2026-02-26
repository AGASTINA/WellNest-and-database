package com.wellnest.repository;

import com.wellnest.entity.WorkoutPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutPlanRepository extends JpaRepository<WorkoutPlan, Long> {
    List<WorkoutPlan> findByUserId(Long userId);
    List<WorkoutPlan> findByUserIdAndIsActive(Long userId, Boolean isActive);
    Optional<WorkoutPlan> findByIdAndUserId(Long id, Long userId);
}
