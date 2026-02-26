package com.wellnest.repository;

import com.wellnest.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findBySpecializationAndIsAvailableTrue(String specialization);
    List<Doctor> findByCityAndIsAvailableTrue(String city);
    List<Doctor> findByIsAvailableTrue();
    
    @Query("SELECT d FROM Doctor d WHERE d.isAvailable = true AND " +
           "LOWER(d.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(d.specialization) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Doctor> searchDoctors(@Param("keyword") String keyword);
}
