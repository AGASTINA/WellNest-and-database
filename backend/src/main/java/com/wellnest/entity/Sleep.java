package com.wellnest.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "sleep_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sleep {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private LocalDate sleepDate;
    
    @Column(nullable = false)
    private LocalTime bedTime;
    
    @Column(nullable = false)
    private LocalTime wakeTime;
    
    @Column(nullable = false)
    private Double hoursSlept; // Total hours of sleep
    
    @Column
    private Integer sleepQuality; // 1-5 rating
    
    @Column
    private String notes; // Optional notes about sleep quality or hydration
    
    @Column
    private Integer waterGlasses; // Number of glasses of water consumed
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
