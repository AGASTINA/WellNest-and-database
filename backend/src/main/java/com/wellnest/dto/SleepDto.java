package com.wellnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SleepDto {
    private Long id;
    private LocalDate sleepDate;
    private LocalTime bedTime;
    private LocalTime wakeTime;
    private Double hoursSlept;
    private Integer sleepQuality; // 1-5 rating
    private String notes;
    private Integer waterGlasses;
}
