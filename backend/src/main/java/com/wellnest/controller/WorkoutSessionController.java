package com.wellnest.controller;

import com.wellnest.dto.WorkoutSessionDto;
import com.wellnest.service.UserService;
import com.wellnest.service.WorkoutSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/workout-sessions")
@RequiredArgsConstructor
public class WorkoutSessionController {

    private final WorkoutSessionService workoutSessionService;
    private final UserService userService;

    @PostMapping
    @SuppressWarnings("null")
    public ResponseEntity<WorkoutSessionDto> logWorkoutSession(@RequestBody WorkoutSessionDto sessionDto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserProfile(email).getId();
        
        WorkoutSessionDto created = workoutSessionService.logWorkoutSession(userId, sessionDto);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    @SuppressWarnings("null")
    public ResponseEntity<List<WorkoutSessionDto>> getUserSessions() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserProfile(email).getId();
        
        List<WorkoutSessionDto> sessions = workoutSessionService.getUserSessions(userId);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/date-range")
    @SuppressWarnings("null")
    public ResponseEntity<List<WorkoutSessionDto>> getSessionsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserProfile(email).getId();
        
        List<WorkoutSessionDto> sessions = workoutSessionService.getSessionsByDateRange(userId, startDate, endDate);
        return ResponseEntity.ok(sessions);
    }
}
