package com.wellnest.repository;

import com.wellnest.entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByUserIdOrderByRecordDateDesc(Long userId);
    List<MedicalRecord> findByUserIdAndRecordType(Long userId, String recordType);
}
