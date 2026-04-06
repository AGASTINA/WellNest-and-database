package com.wellnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeviceIntegrationDto {
    private Long id;
    private String provider;
    private String deviceName;
    private String status;
    private LocalDateTime lastSyncedAt;
    private LocalDateTime createdAt;
}
