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
    private String consultationType;
    private LocalDateTime scheduledAt;
    private String symptoms;
    private String notes;
}
