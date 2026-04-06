package com.wellnest.service;

import com.wellnest.dto.DeviceConnectRequest;
import com.wellnest.dto.DeviceIntegrationDto;
import com.wellnest.dto.DeviceSyncResponseDto;
import com.wellnest.dto.HealthMetricsDto;
import com.wellnest.entity.ConnectedDevice;
import com.wellnest.entity.User;
import com.wellnest.repository.ConnectedDeviceRepository;
import com.wellnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class DeviceIntegrationService {

    private final ConnectedDeviceRepository connectedDeviceRepository;
    private final UserRepository userRepository;
    private final HealthMetricsService healthMetricsService;

    @Transactional
    @SuppressWarnings("null")
    public DeviceIntegrationDto connectDevice(Long userId, DeviceConnectRequest request) {
        userId = Objects.requireNonNull(userId, "userId is required");
        request = Objects.requireNonNull(request, "request is required");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String provider = normalizeProvider(request.getProvider());
        String deviceName = (request.getDeviceName() == null || request.getDeviceName().isBlank())
                ? defaultDeviceName(provider)
                : request.getDeviceName().trim();

        ConnectedDevice device = new ConnectedDevice();
        device.setUser(user);
        device.setProvider(provider);
        device.setDeviceName(deviceName);
        device.setStatus("CONNECTED");
        device.setAccessToken("mock-access-token-" + provider.toLowerCase(Locale.ROOT));
        device.setRefreshToken("mock-refresh-token-" + provider.toLowerCase(Locale.ROOT));

        ConnectedDevice saved = connectedDeviceRepository.save(device);
        return toDto(saved);
    }

    public List<DeviceIntegrationDto> listDevices(Long userId) {
        return connectedDeviceRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public DeviceSyncResponseDto syncDevice(Long userId, Long deviceId) {
        ConnectedDevice device = connectedDeviceRepository.findByIdAndUserId(deviceId, userId)
                .orElseThrow(() -> new RuntimeException("Device not found"));

        HealthMetricsDto imported = generateMockMetrics(device.getProvider());
        HealthMetricsDto savedMetrics = healthMetricsService.recordHealthMetrics(userId, imported);

        LocalDateTime now = LocalDateTime.now();
        device.setLastSyncedAt(now);
        device.setStatus("CONNECTED");
        connectedDeviceRepository.save(device);

        return new DeviceSyncResponseDto(
                device.getId(),
                device.getProvider(),
                "SYNCED",
                now,
                savedMetrics
        );
    }

    @Transactional
    @SuppressWarnings("null")
    public void disconnectDevice(Long userId, Long deviceId) {
        userId = Objects.requireNonNull(userId, "userId is required");
        deviceId = Objects.requireNonNull(deviceId, "deviceId is required");

        ConnectedDevice device = connectedDeviceRepository.findByIdAndUserId(deviceId, userId)
                .orElseThrow(() -> new RuntimeException("Device not found"));
        connectedDeviceRepository.delete(device);
    }

    private DeviceIntegrationDto toDto(ConnectedDevice device) {
        return new DeviceIntegrationDto(
                device.getId(),
                device.getProvider(),
                device.getDeviceName(),
                device.getStatus(),
                device.getLastSyncedAt(),
                device.getCreatedAt()
        );
    }

    private String normalizeProvider(String provider) {
        String value = provider == null ? "" : provider.trim().toUpperCase(Locale.ROOT);
        return switch (value) {
            case "GOOGLE_FIT", "GOOGLEFIT", "GOOGLE" -> "GOOGLE_FIT";
            case "APPLE_HEALTH", "HEALTHKIT", "APPLE" -> "APPLE_HEALTH";
            case "FITBIT" -> "FITBIT";
            case "GARMIN" -> "GARMIN";
            case "SAMSUNG_HEALTH", "SAMSUNG" -> "SAMSUNG_HEALTH";
            default -> "GOOGLE_FIT";
        };
    }

    private String defaultDeviceName(String provider) {
        return switch (provider) {
            case "APPLE_HEALTH" -> "Apple Health (iPhone/Apple Watch)";
            case "FITBIT" -> "Fitbit Device";
            case "GARMIN" -> "Garmin Watch";
            case "SAMSUNG_HEALTH" -> "Samsung Health Device";
            default -> "Google Fit / Health Connect";
        };
    }

    private HealthMetricsDto generateMockMetrics(String provider) {
        ThreadLocalRandom random = ThreadLocalRandom.current();

        HealthMetricsDto dto = new HealthMetricsDto();
        dto.setStepsCount(random.nextInt(3200, 12500));
        dto.setHeartRate(random.nextInt(58, 108));
        dto.setCaloriesBurned(random.nextInt(180, 980));
        dto.setWorkoutDurationMinutes(random.nextInt(18, 95));
        dto.setOxygenSaturation(random.nextInt(94, 100));
        dto.setBloodPressureSystolic(random.nextInt(105, 136));
        dto.setBloodPressureDiastolic(random.nextInt(66, 90));
        dto.setBodyTemperature(Math.round(random.nextDouble(36.2, 37.3) * 10.0) / 10.0);
        dto.setRecordedAt(LocalDateTime.now());
        dto.setNotes("Imported from " + provider + " (MVP sync)");
        return dto;
    }
}
