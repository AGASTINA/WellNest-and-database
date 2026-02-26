package com.wellnest.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_metrics")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthMetrics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "blood_pressure_systolic")
    private Integer bloodPressureSystolic;

    @Column(name = "blood_pressure_diastolic")
    private Integer bloodPressureDiastolic;

    @Column(name = "heart_rate")
    private Integer heartRate;

    @Column(name = "blood_sugar")
    private Double bloodSugar;

    @Column(name = "cholesterol_total")
    private Double cholesterolTotal;

    @Column(name = "cholesterol_hdl")
    private Double cholesterolHDL;

    @Column(name = "cholesterol_ldl")
    private Double cholesterolLDL;

    @Column(name = "body_temperature")
    private Double bodyTemperature;

    @Column(name = "oxygen_saturation")
    private Integer oxygenSaturation;

    private Double weight;
    
    private Double height;

    @Column(name = "bmi")
    private Double bmi;

    @Column(name = "steps_count")
    private Integer stepsCount;

    @Column(name = "calories_burned")
    private Integer caloriesBurned;

    @Column(name = "workout_duration_minutes")
    private Integer workoutDurationMinutes;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "recorded_at", nullable = false)
    private LocalDateTime recordedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (recordedAt == null) {
            recordedAt = LocalDateTime.now();
        }
        if (weight != null && height != null && height > 0) {
            bmi = weight / ((height / 100) * (height / 100));
        }
    }
}
