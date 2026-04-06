package com.wellnest.controller;

import com.wellnest.dto.DeviceConnectRequest;
import com.wellnest.dto.DeviceIntegrationDto;
import com.wellnest.dto.DeviceSyncResponseDto;
import com.wellnest.service.DeviceIntegrationService;
import com.wellnest.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/device-integrations")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed.origins}")
public class DeviceIntegrationController {

    private final DeviceIntegrationService deviceIntegrationService;
    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<DeviceIntegrationDto>> listDevices() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(deviceIntegrationService.listDevices(userId));
    }

    @PostMapping("/connect")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<DeviceIntegrationDto> connectDevice(@RequestBody DeviceConnectRequest request) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(deviceIntegrationService.connectDevice(userId, request));
    }

    @PostMapping("/{deviceId}/sync")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<DeviceSyncResponseDto> syncDevice(@PathVariable Long deviceId) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(deviceIntegrationService.syncDevice(userId, deviceId));
    }

    @DeleteMapping("/{deviceId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> disconnectDevice(@PathVariable Long deviceId) {
        Long userId = getCurrentUserId();
        deviceIntegrationService.disconnectDevice(userId, deviceId);
        return ResponseEntity.ok("Device disconnected successfully");
    }

    private Long getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userService.getUserProfile(email).getId();
    }
}
