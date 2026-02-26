package com.wellnest.repository;

import com.wellnest.entity.Sleep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SleepRepository extends JpaRepository<Sleep, Long> {
    
    List<Sleep> findByUserIdOrderBySleepDateDesc(Long userId);
    
    Optional<Sleep> findByUserIdAndSleepDate(Long userId, LocalDate sleepDate);
    
    List<Sleep> findByUserIdAndSleepDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT AVG(s.hoursSlept) FROM Sleep s WHERE s.user.id = :userId AND s.sleepDate BETWEEN :startDate AND :endDate")
    Double getAverageSleepHours(@Param("userId") Long userId, 
                                @Param("startDate") LocalDate startDate, 
                                @Param("endDate") LocalDate endDate);
    
    @Query("SELECT AVG(s.sleepQuality) FROM Sleep s WHERE s.user.id = :userId AND s.sleepDate BETWEEN :startDate AND :endDate")
    Double getAverageSleepQuality(@Param("userId") Long userId, 
                                   @Param("startDate") LocalDate startDate, 
                                   @Param("endDate") LocalDate endDate);
    
    @Query("SELECT SUM(s.waterGlasses) FROM Sleep s WHERE s.user.id = :userId AND s.sleepDate BETWEEN :startDate AND :endDate")
    Integer getTotalWaterIntake(@Param("userId") Long userId, 
                                 @Param("startDate") LocalDate startDate, 
                                 @Param("endDate") LocalDate endDate);
}
