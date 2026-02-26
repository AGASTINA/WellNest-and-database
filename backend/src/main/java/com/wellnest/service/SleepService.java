package com.wellnest.service;

import com.wellnest.dto.SleepDto;
import com.wellnest.entity.Sleep;
import com.wellnest.entity.User;
import com.wellnest.repository.SleepRepository;
import com.wellnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SleepService {
    
    private final SleepRepository sleepRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public SleepDto logSleep(Long userId, SleepDto sleepDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if sleep log already exists for this date
        sleepRepository.findByUserIdAndSleepDate(userId, sleepDto.getSleepDate())
                .ifPresent(existingSleep -> {
                    throw new RuntimeException("Sleep log already exists for this date. Please update the existing log.");
                });
        
        Sleep sleep = new Sleep();
        sleep.setUser(user);
        sleep.setSleepDate(sleepDto.getSleepDate());
        sleep.setBedTime(sleepDto.getBedTime());
        sleep.setWakeTime(sleepDto.getWakeTime());
        sleep.setHoursSlept(sleepDto.getHoursSlept());
        sleep.setSleepQuality(sleepDto.getSleepQuality());
        sleep.setNotes(sleepDto.getNotes());
        sleep.setWaterGlasses(sleepDto.getWaterGlasses());
        
        Sleep saved = sleepRepository.save(sleep);
        return convertToDto(saved);
    }
    
    @Transactional
    public SleepDto updateSleep(Long userId, Long sleepId, SleepDto sleepDto) {
        Sleep sleep = sleepRepository.findById(sleepId)
                .orElseThrow(() -> new RuntimeException("Sleep log not found"));
        
        if (!sleep.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to sleep log");
        }
        
        sleep.setSleepDate(sleepDto.getSleepDate());
        sleep.setBedTime(sleepDto.getBedTime());
        sleep.setWakeTime(sleepDto.getWakeTime());
        sleep.setHoursSlept(sleepDto.getHoursSlept());
        sleep.setSleepQuality(sleepDto.getSleepQuality());
        sleep.setNotes(sleepDto.getNotes());
        sleep.setWaterGlasses(sleepDto.getWaterGlasses());
        
        Sleep updated = sleepRepository.save(sleep);
        return convertToDto(updated);
    }
    
    public List<SleepDto> getUserSleepLogs(Long userId) {
        return sleepRepository.findByUserIdOrderBySleepDateDesc(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public SleepDto getSleepByDate(Long userId, LocalDate date) {
        return sleepRepository.findByUserIdAndSleepDate(userId, date)
                .map(this::convertToDto)
                .orElse(null);
    }
    
    public List<SleepDto> getSleepLogsByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        return sleepRepository.findByUserIdAndSleepDateBetween(userId, startDate, endDate)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void deleteSleep(Long userId, Long sleepId) {
        Sleep sleep = sleepRepository.findById(sleepId)
                .orElseThrow(() -> new RuntimeException("Sleep log not found"));
        
        if (!sleep.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to sleep log");
        }
        
        sleepRepository.delete(sleep);
    }
    
    public Double getAverageSleepHours(Long userId, LocalDate startDate, LocalDate endDate) {
        Double avg = sleepRepository.getAverageSleepHours(userId, startDate, endDate);
        return avg != null ? avg : 0.0;
    }
    
    public Double getAverageSleepQuality(Long userId, LocalDate startDate, LocalDate endDate) {
        Double avg = sleepRepository.getAverageSleepQuality(userId, startDate, endDate);
        return avg != null ? avg : 0.0;
    }
    
    public Integer getTotalWaterIntake(Long userId, LocalDate startDate, LocalDate endDate) {
        Integer total = sleepRepository.getTotalWaterIntake(userId, startDate, endDate);
        return total != null ? total : 0;
    }
    
    private SleepDto convertToDto(Sleep sleep) {
        SleepDto dto = new SleepDto();
        dto.setId(sleep.getId());
        dto.setSleepDate(sleep.getSleepDate());
        dto.setBedTime(sleep.getBedTime());
        dto.setWakeTime(sleep.getWakeTime());
        dto.setHoursSlept(sleep.getHoursSlept());
        dto.setSleepQuality(sleep.getSleepQuality());
        dto.setNotes(sleep.getNotes());
        dto.setWaterGlasses(sleep.getWaterGlasses());
        return dto;
    }
}
