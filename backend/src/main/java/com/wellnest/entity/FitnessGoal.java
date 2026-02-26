package com.wellnest.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "fitness_goals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FitnessGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "goal_type", nullable = false)
    private String goalType; // WEIGHT_LOSS, MUSCLE_GAIN, ENDURANCE, FLEXIBILITY, GENERAL_FITNESS

    @Column(name = "target_weight")
    private Double targetWeight;

    @Column(name = "target_calories")
    private Integer targetCalories;

    @Column(name = "target_steps")
    private Integer targetSteps;

    @Column(name = "target_workout_minutes")
    private Integer targetWorkoutMinutes;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "target_date")
    private LocalDateTime targetDate;

    @Column(name = "status", nullable = false)
    private String status; // ACTIVE, COMPLETED, PAUSED, ABANDONED

    @Column(name = "progress_percentage")
    private Double progressPercentage;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = "ACTIVE";
        }
        if (progressPercentage == null) {
            progressPercentage = 0.0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
