package com.wellnest.repository;

import com.wellnest.entity.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    List<Consultation> findByUserIdOrderByScheduledAtDesc(Long userId);
    List<Consultation> findByDoctorIdOrderByScheduledAtDesc(Long doctorId);
    List<Consultation> findByUserIdAndStatus(Long userId, String status);
    List<Consultation> findByUserIdAndScheduledAtBetween(Long userId, LocalDateTime start, LocalDateTime end);
}
