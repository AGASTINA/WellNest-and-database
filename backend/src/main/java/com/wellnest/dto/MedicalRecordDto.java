package com.wellnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecordDto {
    private Long id;
    private Long userId;
    private String recordType;
    private String title;
    private String description;
    private String doctorName;
    private String hospitalName;
    private String diagnosis;
    private String medications;
    private String allergies;
    private String bloodType;
    private String chronicConditions;
    private LocalDateTime recordDate;
    private LocalDateTime createdAt;
}
