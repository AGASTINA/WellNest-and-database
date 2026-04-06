package com.wellnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationRequest {
    private Long doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private String doctorQualification;
    private String doctorHospitalName;
    private String doctorCity;
    private String doctorState;
    private Double doctorConsultationFee;
    private String consultationType;
    private LocalDateTime scheduledAt;
    private String symptoms;
    private String notes;
}
