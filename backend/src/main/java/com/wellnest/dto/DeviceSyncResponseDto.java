package com.wellnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeviceSyncResponseDto {
    private Long deviceId;
    private String provider;
    private String status;
    private LocalDateTime syncedAt;
    private HealthMetricsDto importedMetrics;
}
