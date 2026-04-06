package com.wellnest.repository;

import com.wellnest.entity.ConnectedDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectedDeviceRepository extends JpaRepository<ConnectedDevice, Long> {
    List<ConnectedDevice> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<ConnectedDevice> findByIdAndUserId(Long id, Long userId);
}
