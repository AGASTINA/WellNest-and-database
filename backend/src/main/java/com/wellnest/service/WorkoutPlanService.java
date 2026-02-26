package com.wellnest.service;

import com.wellnest.dto.WorkoutPlanDto;
import com.wellnest.entity.WorkoutPlan;
import com.wellnest.entity.User;
import com.wellnest.repository.WorkoutPlanRepository;
import com.wellnest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class WorkoutPlanService {

    @Autowired
    private WorkoutPlanRepository workoutPlanRepository;

    @Autowired
    private UserRepository userRepository;

    public WorkoutPlanDto createWorkoutPlan(Long userId, WorkoutPlanDto workoutPlanDto) {
        if (userId == null) {
            throw new RuntimeException("User ID is null in token");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId + ". Please make sure you are logged in and the user exists in the database."));

        WorkoutPlan workoutPlan = new WorkoutPlan();
        workoutPlan.setUser(user);
        workoutPlan.setName(workoutPlanDto.getName());
        workoutPlan.setDescription(workoutPlanDto.getDescription());
        workoutPlan.setDurationMinutes(workoutPlanDto.getDurationMinutes());
        workoutPlan.setIsActive(true);
        workoutPlan.setCompletedCount(0);

        WorkoutPlan savedPlan = workoutPlanRepository.save(workoutPlan);
        return convertToDto(savedPlan);
    }

    public WorkoutPlanDto getWorkoutPlanById(Long id, Long userId) {
        WorkoutPlan workoutPlan = workoutPlanRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Workout plan not found"));
        return convertToDto(workoutPlan);
    }

    public List<WorkoutPlanDto> getUserWorkoutPlans(Long userId) {
        List<WorkoutPlan> plans = workoutPlanRepository.findByUserId(userId);
        return plans.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public List<WorkoutPlanDto> getActiveWorkoutPlans(Long userId) {
        List<WorkoutPlan> plans = workoutPlanRepository.findByUserIdAndIsActive(userId, true);
        return plans.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public WorkoutPlanDto updateWorkoutPlan(Long id, Long userId, WorkoutPlanDto workoutPlanDto) {
        WorkoutPlan workoutPlan = workoutPlanRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Workout plan not found"));

        workoutPlan.setName(workoutPlanDto.getName());
        workoutPlan.setDescription(workoutPlanDto.getDescription());
        workoutPlan.setDurationMinutes(workoutPlanDto.getDurationMinutes());

        WorkoutPlan updatedPlan = workoutPlanRepository.save(workoutPlan);
        return convertToDto(updatedPlan);
    }

    @SuppressWarnings("null")
    public void deleteWorkoutPlan(Long id, Long userId) {
        WorkoutPlan workoutPlan = workoutPlanRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Workout plan not found"));
        workoutPlanRepository.delete(workoutPlan);
    }

    public WorkoutPlanDto completeWorkoutPlan(Long id, Long userId) {
        WorkoutPlan workoutPlan = workoutPlanRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Workout plan not found"));
        
        workoutPlan.setCompletedCount(workoutPlan.getCompletedCount() + 1);
        workoutPlan.setLastCompletedAt(LocalDateTime.now());

        WorkoutPlan updatedPlan = workoutPlanRepository.save(workoutPlan);
        return convertToDto(updatedPlan);
    }

    private WorkoutPlanDto convertToDto(WorkoutPlan workoutPlan) {
        WorkoutPlanDto dto = new WorkoutPlanDto();
        dto.setId(workoutPlan.getId());
        dto.setName(workoutPlan.getName());
        dto.setDescription(workoutPlan.getDescription());
        dto.setDurationMinutes(workoutPlan.getDurationMinutes());
        dto.setIsActive(workoutPlan.getIsActive());
        dto.setCompletedCount(workoutPlan.getCompletedCount());
        dto.setLastCompletedAt(workoutPlan.getLastCompletedAt());
        dto.setCreatedAt(workoutPlan.getCreatedAt());
        dto.setUpdatedAt(workoutPlan.getUpdatedAt());
        return dto;
    }
}
