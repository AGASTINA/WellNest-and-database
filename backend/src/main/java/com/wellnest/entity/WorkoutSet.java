package com.wellnest.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "workout_sets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutSet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @Column(name = "set_number")
    private Integer setNumber;

    @Column(nullable = false)
    private Integer reps;

    @Column(nullable = false)
    private Double weight;

    @Column(name = "weight_unit")
    private String weightUnit = "kg";

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "is_completed")
    private Boolean isCompleted = false;

    @Column(name = "actual_reps")
    private Integer actualReps;

    @Column(name = "actual_weight")
    private Double actualWeight;
}
