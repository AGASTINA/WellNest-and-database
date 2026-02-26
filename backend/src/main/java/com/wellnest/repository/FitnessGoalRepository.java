package com.wellnest.repository;

import com.wellnest.entity.FitnessGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FitnessGoalRepository extends JpaRepository<FitnessGoal, Long> {
    
    List<FitnessGoal> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<FitnessGoal> findByUserIdAndStatus(Long userId, String status);
    
    @Query("SELECT g FROM FitnessGoal g WHERE g.user.id = ?1 AND g.status = 'ACTIVE'")
    List<FitnessGoal> findActiveGoalsByUserId(Long userId);
}
