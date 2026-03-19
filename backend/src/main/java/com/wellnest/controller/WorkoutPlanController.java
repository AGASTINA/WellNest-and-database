package com.wellnest.controller;

import com.wellnest.dto.WorkoutPlanDto;
import com.wellnest.dto.MessageResponse;
import com.wellnest.service.WorkoutPlanService;
import com.wellnest.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/workout-plans")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"})
public class WorkoutPlanController {

    @Autowired
    private WorkoutPlanService workoutPlanService;

    @Autowired
    private UserService userService;

    private Long extractUserIdFromSecurityContext() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            throw new RuntimeException("Session expired. Please log in again.");
        }

        String email = authentication.getName();
        return userService.getUserProfile(email).getId();
    }

    @PostMapping
    public ResponseEntity<?> createWorkoutPlan(
            @RequestBody WorkoutPlanDto workoutPlanDto,
            HttpServletRequest request) {
        try {
            Long userId = extractUserIdFromSecurityContext();
            WorkoutPlanDto createdPlan = workoutPlanService.createWorkoutPlan(userId, workoutPlanDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPlan);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserWorkoutPlans(HttpServletRequest request) {
        try {
            Long userId = extractUserIdFromSecurityContext();
            List<WorkoutPlanDto> plans = workoutPlanService.getUserWorkoutPlans(userId);
            return ResponseEntity.ok(plans);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActiveWorkoutPlans(HttpServletRequest request) {
        try {
            Long userId = extractUserIdFromSecurityContext();
            List<WorkoutPlanDto> plans = workoutPlanService.getActiveWorkoutPlans(userId);
            return ResponseEntity.ok(plans);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getWorkoutPlanById(
            @PathVariable Long id,
            HttpServletRequest request) {
        try {
            Long userId = extractUserIdFromSecurityContext();
            WorkoutPlanDto plan = workoutPlanService.getWorkoutPlanById(id, userId);
            return ResponseEntity.ok(plan);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateWorkoutPlan(
            @PathVariable Long id,
            @RequestBody WorkoutPlanDto workoutPlanDto,
            HttpServletRequest request) {
        try {
            Long userId = extractUserIdFromSecurityContext();
            WorkoutPlanDto updatedPlan = workoutPlanService.updateWorkoutPlan(id, userId, workoutPlanDto);
            return ResponseEntity.ok(updatedPlan);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWorkoutPlan(
            @PathVariable Long id,
            HttpServletRequest request) {
        try {
            Long userId = extractUserIdFromSecurityContext();
            workoutPlanService.deleteWorkoutPlan(id, userId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<?> completeWorkoutPlan(
            @PathVariable Long id,
            HttpServletRequest request) {
        try {
            Long userId = extractUserIdFromSecurityContext();
            WorkoutPlanDto completedPlan = workoutPlanService.completeWorkoutPlan(id, userId);
            return ResponseEntity.ok(completedPlan);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
