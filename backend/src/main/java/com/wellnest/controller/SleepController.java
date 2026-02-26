package com.wellnest.controller;

import com.wellnest.dto.SleepDto;
import com.wellnest.service.SleepService;
import com.wellnest.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/sleep")
@RequiredArgsConstructor
public class SleepController {
    
    private final SleepService sleepService;
    private final UserService userService;
    
    @PostMapping
    @SuppressWarnings("null")
    public ResponseEntity<SleepDto> logSleep(@RequestBody SleepDto sleepDto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserProfile(email).getId();
        
        SleepDto created = sleepService.logSleep(userId, sleepDto);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<SleepDto> updateSleep(@PathVariable Long id, @RequestBody SleepDto sleepDto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserProfile(email).getId();
        
        SleepDto updated = sleepService.updateSleep(userId, id, sleepDto);
        return ResponseEntity.ok(updated);
    }
    
    @GetMapping
    @SuppressWarnings("null")
    public ResponseEntity<List<SleepDto>> getUserSleepLogs() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserProfile(email).getId();
        
        List<SleepDto> logs = sleepService.getUserSleepLogs(userId);
        return ResponseEntity.ok(logs);
    }
    
    @GetMapping("/date/{date}")
    @SuppressWarnings("null")
    public ResponseEntity<SleepDto> getSleepByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserProfile(email).getId();
        
        SleepDto sleepLog = sleepService.getSleepByDate(userId, date);
        return ResponseEntity.ok(sleepLog);
    }
    
    @GetMapping("/date-range")
    @SuppressWarnings("null")
    public ResponseEntity<List<SleepDto>> getSleepLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserProfile(email).getId();
        
        List<SleepDto> logs = sleepService.getSleepLogsByDateRange(userId, startDate, endDate);
        return ResponseEntity.ok(logs);
    }
    
    @DeleteMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<Void> deleteSleep(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserProfile(email).getId();
        
        sleepService.deleteSleep(userId, id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/stats/average-hours")
    @SuppressWarnings("null")
    public ResponseEntity<Double> getAverageSleepHours(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserProfile(email).getId();
        
        Double avgHours = sleepService.getAverageSleepHours(userId, startDate, endDate);
        return ResponseEntity.ok(avgHours);
    }
    
    @GetMapping("/stats/average-quality")
    @SuppressWarnings("null")
    public ResponseEntity<Double> getAverageSleepQuality(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserProfile(email).getId();
        
        Double avgQuality = sleepService.getAverageSleepQuality(userId, startDate, endDate);
        return ResponseEntity.ok(avgQuality);
    }
    
    @GetMapping("/stats/water-intake")
    @SuppressWarnings("null")
    public ResponseEntity<Integer> getTotalWaterIntake(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserProfile(email).getId();
        
        Integer totalWater = sleepService.getTotalWaterIntake(userId, startDate, endDate);
        return ResponseEntity.ok(totalWater);
    }
}
