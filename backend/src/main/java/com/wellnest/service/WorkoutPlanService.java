package com.wellnest.service;

import com.wellnest.dto.ExerciseDto;
import com.wellnest.dto.WorkoutSetDto;
import com.wellnest.dto.WorkoutPlanDto;
import com.wellnest.entity.Exercise;
import com.wellnest.entity.WorkoutSet;
import com.wellnest.entity.WorkoutPlan;
import com.wellnest.entity.User;
import com.wellnest.repository.WorkoutPlanRepository;
import com.wellnest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
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
        workoutPlan.setIsActive(true);
        workoutPlan.setCompletedCount(0);
        applyWorkoutPlanFields(workoutPlan, workoutPlanDto);

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

        applyWorkoutPlanFields(workoutPlan, workoutPlanDto);

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
        dto.setExercises(convertExercisesToDto(workoutPlan.getExercises()));
        return dto;
    }

    private void applyWorkoutPlanFields(WorkoutPlan workoutPlan, WorkoutPlanDto workoutPlanDto) {
        workoutPlan.setName(workoutPlanDto.getName());
        workoutPlan.setDescription(workoutPlanDto.getDescription());
        workoutPlan.setDurationMinutes(workoutPlanDto.getDurationMinutes());
        workoutPlan.setExercises(convertExercisesToEntities(workoutPlan, workoutPlanDto.getExercises()));
    }

    private List<Exercise> convertExercisesToEntities(WorkoutPlan workoutPlan, List<ExerciseDto> exerciseDtos) {
        if (exerciseDtos == null || exerciseDtos.isEmpty()) {
            return new ArrayList<>();
        }

        List<ExerciseDto> sortedExerciseDtos = new ArrayList<>(exerciseDtos);
        sortedExerciseDtos.sort(Comparator.comparing(dto -> dto.getExerciseOrder() != null ? dto.getExerciseOrder() : Integer.MAX_VALUE));

        List<Exercise> exercises = new ArrayList<>();
        for (int exerciseIndex = 0; exerciseIndex < sortedExerciseDtos.size(); exerciseIndex++) {
            ExerciseDto exerciseDto = sortedExerciseDtos.get(exerciseIndex);
            Exercise exercise = new Exercise();
            exercise.setId(exerciseDto.getId());
            exercise.setWorkoutPlan(workoutPlan);
            exercise.setName(exerciseDto.getName());
            exercise.setType(exerciseDto.getType());
            exercise.setNotes(exerciseDto.getNotes());
            exercise.setImageUrl(exerciseDto.getImageUrl());
            exercise.setExerciseOrder(exerciseDto.getExerciseOrder() != null ? exerciseDto.getExerciseOrder() : exerciseIndex + 1);
            exercise.setRestSeconds(exerciseDto.getRestSeconds() != null ? exerciseDto.getRestSeconds() : 0);
            exercise.setInstructions(exerciseDto.getInstructions());
            exercise.setSets(convertSetsToEntities(exercise, exerciseDto.getSets()));
            exercises.add(exercise);
        }

        return exercises;
    }

    private List<WorkoutSet> convertSetsToEntities(Exercise exercise, List<WorkoutSetDto> setDtos) {
        if (setDtos == null || setDtos.isEmpty()) {
            return new ArrayList<>();
        }

        List<WorkoutSet> sets = new ArrayList<>();
        for (int setIndex = 0; setIndex < setDtos.size(); setIndex++) {
            WorkoutSetDto setDto = setDtos.get(setIndex);
            WorkoutSet workoutSet = new WorkoutSet();
            workoutSet.setId(setDto.getId());
            workoutSet.setExercise(exercise);
            workoutSet.setSetNumber(setDto.getSetNumber() != null ? setDto.getSetNumber() : setIndex + 1);
            workoutSet.setReps(setDto.getReps() != null ? setDto.getReps() : 0);
            workoutSet.setWeight(setDto.getWeight() != null ? setDto.getWeight() : 0.0);
            workoutSet.setWeightUnit(setDto.getWeightUnit() != null && !setDto.getWeightUnit().isBlank() ? setDto.getWeightUnit() : "kg");
            workoutSet.setNotes(setDto.getNotes());
            workoutSet.setIsCompleted(setDto.getIsCompleted() != null ? setDto.getIsCompleted() : false);
            workoutSet.setActualReps(setDto.getActualReps());
            workoutSet.setActualWeight(setDto.getActualWeight());
            sets.add(workoutSet);
        }

        return sets;
    }

    private List<ExerciseDto> convertExercisesToDto(List<Exercise> exercises) {
        if (exercises == null || exercises.isEmpty()) {
            return new ArrayList<>();
        }

        return exercises.stream()
                .sorted(Comparator.comparing(exercise -> exercise.getExerciseOrder() != null ? exercise.getExerciseOrder() : Integer.MAX_VALUE))
                .map(this::convertExerciseToDto)
                .collect(Collectors.toList());
    }

    private ExerciseDto convertExerciseToDto(Exercise exercise) {
        ExerciseDto dto = new ExerciseDto();
        dto.setId(exercise.getId());
        dto.setName(exercise.getName());
        dto.setType(exercise.getType());
        dto.setNotes(exercise.getNotes());
        dto.setImageUrl(exercise.getImageUrl());
        dto.setExerciseOrder(exercise.getExerciseOrder());
        dto.setSets(convertSetsToDto(exercise.getSets()));
        dto.setRestSeconds(exercise.getRestSeconds());
        dto.setInstructions(exercise.getInstructions());
        return dto;
    }

    private List<WorkoutSetDto> convertSetsToDto(List<WorkoutSet> sets) {
        if (sets == null || sets.isEmpty()) {
            return new ArrayList<>();
        }

        return sets.stream()
                .sorted(Comparator.comparing(set -> set.getSetNumber() != null ? set.getSetNumber() : Integer.MAX_VALUE))
                .map(set -> new WorkoutSetDto(
                        set.getId(),
                        set.getSetNumber(),
                        set.getReps(),
                        set.getWeight(),
                        set.getWeightUnit(),
                        set.getNotes(),
                        set.getIsCompleted(),
                        set.getActualReps(),
                        set.getActualWeight()))
                .collect(Collectors.toList());
    }
}
