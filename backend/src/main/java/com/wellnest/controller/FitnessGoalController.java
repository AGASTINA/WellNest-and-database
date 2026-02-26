package com.wellnest.controller;

import com.wellnest.dto.FitnessGoalDto;
import com.wellnest.service.FitnessGoalService;
import com.wellnest.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fitness-goals")
@RequiredArgsConstructor
public class FitnessGoalController {

    private final FitnessGoalService fitnessGoalService;
    private final UserService userService;

    @PostMapping
    @SuppressWarnings("null")
    public ResponseEntity<FitnessGoalDto> createGoal(@RequestBody FitnessGoalDto goalDto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserProfile(email).getId();
        
        FitnessGoalDto created = fitnessGoalService.createGoal(userId, goalDto);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    @SuppressWarnings("null")
    public ResponseEntity<List<FitnessGoalDto>> getUserGoals() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserProfile(email).getId();
        
        List<FitnessGoalDto> goals = fitnessGoalService.getUserGoals(userId);
        return ResponseEntity.ok(goals);
    }

    @GetMapping("/active")
    @SuppressWarnings("null")
    public ResponseEntity<List<FitnessGoalDto>> getActiveGoals() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserProfile(email).getId();
        
        List<FitnessGoalDto> activeGoals = fitnessGoalService.getActiveGoals(userId);
        return ResponseEntity.ok(activeGoals);
    }

    @PutMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<FitnessGoalDto> updateGoal(
            @PathVariable Long id,
            @RequestBody FitnessGoalDto goalDto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserProfile(email).getId();
        
        FitnessGoalDto updated = fitnessGoalService.updateGoal(id, userId, goalDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserProfile(email).getId();
        
        fitnessGoalService.deleteGoal(id, userId);
        return ResponseEntity.noContent().build();
    }
}
