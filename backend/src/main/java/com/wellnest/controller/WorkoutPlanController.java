package com.wellnest.controller;

import com.wellnest.dto.WorkoutPlanDto;
import com.wellnest.dto.MessageResponse;
import com.wellnest.service.WorkoutPlanService;
import com.wellnest.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/workout-plans")
@CrossOrigin(origins = "http://localhost:3000")
public class WorkoutPlanController {

    @Autowired
    private WorkoutPlanService workoutPlanService;

    @Autowired
    private JwtService jwtService;

    /**
     * Extract user ID from JWT token in Authorization header
     */
    private Long extractUserIdFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid authorization header");
        }
        
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        
        try {
            Long userId = jwtService.extractUserId(token);
            if (userId == null) {
                throw new RuntimeException("User ID not found in token");
            }
            return userId;
        } catch (Exception e) {
            throw new RuntimeException("Invalid or expired token: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createWorkoutPlan(
            @RequestBody WorkoutPlanDto workoutPlanDto,
            HttpServletRequest request) {
        try {
            Long userId = extractUserIdFromRequest(request);
            WorkoutPlanDto createdPlan = workoutPlanService.createWorkoutPlan(userId, workoutPlanDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPlan);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserWorkoutPlans(HttpServletRequest request) {
        try {
            Long userId = extractUserIdFromRequest(request);
            List<WorkoutPlanDto> plans = workoutPlanService.getUserWorkoutPlans(userId);
            return ResponseEntity.ok(plans);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActiveWorkoutPlans(HttpServletRequest request) {
        try {
            Long userId = extractUserIdFromRequest(request);
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
            Long userId = extractUserIdFromRequest(request);
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
            Long userId = extractUserIdFromRequest(request);
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
            Long userId = extractUserIdFromRequest(request);
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
            Long userId = extractUserIdFromRequest(request);
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
