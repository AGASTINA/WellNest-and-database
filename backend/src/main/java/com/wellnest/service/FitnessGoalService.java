package com.wellnest.service;

import com.wellnest.dto.FitnessGoalDto;
import com.wellnest.entity.FitnessGoal;
import com.wellnest.entity.User;
import com.wellnest.repository.FitnessGoalRepository;
import com.wellnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FitnessGoalService {

    private final FitnessGoalRepository fitnessGoalRepository;
    private final UserRepository userRepository;

    @Transactional
    @SuppressWarnings("null")
    public FitnessGoalDto createGoal(Long userId, FitnessGoalDto goalDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        FitnessGoal goal = new FitnessGoal();
        goal.setUser(user);
        goal.setGoalType(goalDto.getGoalType());
        goal.setTargetWeight(goalDto.getTargetWeight());
        goal.setTargetCalories(goalDto.getTargetCalories());
        goal.setTargetSteps(goalDto.getTargetSteps());
        goal.setTargetWorkoutMinutes(goalDto.getTargetWorkoutMinutes());
        goal.setStartDate(LocalDateTime.now());
        goal.setTargetDate(goalDto.getTargetDate());
        goal.setNotes(goalDto.getNotes());
        
        FitnessGoal saved = fitnessGoalRepository.save(goal);
        return convertToDto(saved);
    }

    public List<FitnessGoalDto> getUserGoals(Long userId) {
        return fitnessGoalRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<FitnessGoalDto> getActiveGoals(Long userId) {
        return fitnessGoalRepository.findActiveGoalsByUserId(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    @SuppressWarnings("null")
    public FitnessGoalDto updateGoal(Long id, Long userId, FitnessGoalDto goalDto) {
        FitnessGoal goal = fitnessGoalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        // Verify the goal belongs to this user
        if (!goal.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to update this goal");
        }

        if (goalDto.getTargetWeight() != null) goal.setTargetWeight(goalDto.getTargetWeight());
        if (goalDto.getTargetCalories() != null) goal.setTargetCalories(goalDto.getTargetCalories());
        if (goalDto.getTargetSteps() != null) goal.setTargetSteps(goalDto.getTargetSteps());
        if (goalDto.getTargetWorkoutMinutes() != null) goal.setTargetWorkoutMinutes(goalDto.getTargetWorkoutMinutes());
        if (goalDto.getTargetDate() != null) goal.setTargetDate(goalDto.getTargetDate());
        if (goalDto.getStatus() != null) goal.setStatus(goalDto.getStatus());
        if (goalDto.getProgressPercentage() != null) goal.setProgressPercentage(goalDto.getProgressPercentage());
        if (goalDto.getNotes() != null) goal.setNotes(goalDto.getNotes());

        FitnessGoal updated = fitnessGoalRepository.save(goal);
        return convertToDto(updated);
    }

    @Transactional
    @SuppressWarnings("null")
    public void deleteGoal(Long id, Long userId) {
        FitnessGoal goal = fitnessGoalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        
        // Verify the goal belongs to this user
        if (!goal.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this goal");
        }
        
        fitnessGoalRepository.deleteById(id);
    }

    private FitnessGoalDto convertToDto(FitnessGoal goal) {
        FitnessGoalDto dto = new FitnessGoalDto();
        dto.setId(goal.getId());
        dto.setUserId(goal.getUser().getId());
        dto.setGoalType(goal.getGoalType());
        dto.setTargetWeight(goal.getTargetWeight());
        dto.setTargetCalories(goal.getTargetCalories());
        dto.setTargetSteps(goal.getTargetSteps());
        dto.setTargetWorkoutMinutes(goal.getTargetWorkoutMinutes());
        dto.setStartDate(goal.getStartDate());
        dto.setTargetDate(goal.getTargetDate());
        dto.setStatus(goal.getStatus());
        dto.setProgressPercentage(goal.getProgressPercentage());
        dto.setNotes(goal.getNotes());
        dto.setCreatedAt(goal.getCreatedAt());
        dto.setUpdatedAt(goal.getUpdatedAt());
        return dto;
    }
}
