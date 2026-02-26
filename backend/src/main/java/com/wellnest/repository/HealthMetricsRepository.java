package com.wellnest.repository;

import com.wellnest.entity.HealthMetrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HealthMetricsRepository extends JpaRepository<HealthMetrics, Long> {
    List<HealthMetrics> findByUserIdOrderByRecordedAtDesc(Long userId);
    List<HealthMetrics> findByUserIdAndRecordedAtBetween(Long userId, LocalDateTime start, LocalDateTime end);
}
