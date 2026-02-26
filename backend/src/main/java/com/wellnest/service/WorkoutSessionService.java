package com.wellnest.service;

import com.wellnest.dto.WorkoutSessionDto;
import com.wellnest.entity.User;
import com.wellnest.entity.WorkoutPlan;
import com.wellnest.entity.WorkoutSession;
import com.wellnest.repository.UserRepository;
import com.wellnest.repository.WorkoutPlanRepository;
import com.wellnest.repository.WorkoutSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkoutSessionService {

    private final WorkoutSessionRepository workoutSessionRepository;
    private final UserRepository userRepository;
    private final WorkoutPlanRepository workoutPlanRepository;

    @Transactional
    @SuppressWarnings("null")
    public WorkoutSessionDto logWorkoutSession(Long userId, WorkoutSessionDto sessionDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        WorkoutSession session = new WorkoutSession();
        session.setUser(user);
        
        if (sessionDto.getWorkoutPlanId() != null) {
            WorkoutPlan plan = workoutPlanRepository.findById(sessionDto.getWorkoutPlanId())
                    .orElse(null);
            session.setWorkoutPlan(plan);
            if (sessionDto.getWorkoutName() == null && plan != null) {
                session.setWorkoutName(plan.getName());
            } else {
                session.setWorkoutName(sessionDto.getWorkoutName());
            }
        } else {
            session.setWorkoutName(sessionDto.getWorkoutName());
        }
        
        session.setWorkoutType(sessionDto.getWorkoutType());
        session.setDurationMinutes(sessionDto.getDurationMinutes());
        session.setCaloriesBurned(sessionDto.getCaloriesBurned());
        session.setCompletedAt(sessionDto.getCompletedAt() != null ? 
            sessionDto.getCompletedAt() : LocalDateTime.now());
        session.setNotes(sessionDto.getNotes());

        WorkoutSession saved = workoutSessionRepository.save(session);
        return convertToDto(saved);
    }

    public List<WorkoutSessionDto> getUserSessions(Long userId) {
        return workoutSessionRepository.findByUserIdOrderByCompletedAtDesc(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<WorkoutSessionDto> getSessionsByDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        return workoutSessionRepository.findByUserIdAndCompletedAtBetween(userId, startDate, endDate)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private WorkoutSessionDto convertToDto(WorkoutSession session) {
        WorkoutSessionDto dto = new WorkoutSessionDto();
        dto.setId(session.getId());
        dto.setUserId(session.getUser().getId());
        dto.setWorkoutPlanId(session.getWorkoutPlan() != null ? session.getWorkoutPlan().getId() : null);
        dto.setWorkoutName(session.getWorkoutName());
        dto.setWorkoutType(session.getWorkoutType());
        dto.setDurationMinutes(session.getDurationMinutes());
        dto.setCaloriesBurned(session.getCaloriesBurned());
        dto.setCompletedAt(session.getCompletedAt());
        dto.setNotes(session.getNotes());
        dto.setCreatedAt(session.getCreatedAt());
        return dto;
    }
}
