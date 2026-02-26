package com.wellnest.repository;

import com.wellnest.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    List<Hospital> findByCityAndIsActiveTrue(String city);
    List<Hospital> findByHospitalTypeAndIsActiveTrue(String hospitalType);
    List<Hospital> findByIsActiveTrue();
    
    @Query("SELECT h FROM Hospital h WHERE h.isActive = true AND " +
           "LOWER(h.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(h.specialties) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Hospital> searchHospitals(@Param("keyword") String keyword);
}
