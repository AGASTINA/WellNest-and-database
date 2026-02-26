package com.wellnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationDto {
    private Long id;
    private Long userId;
    private Long doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private String consultationType;
    private LocalDateTime scheduledAt;
    private String status;
    private String symptoms;
    private String notes;
    private String prescription;
    private String diagnosis;
    private Double consultationFee;
    private String paymentStatus;
}
