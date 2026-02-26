package com.wellnest.repository;

import com.wellnest.entity.Membership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {
    
    List<Membership> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    Optional<Membership> findByUserIdAndStatus(Long userId, String status);
    
    Optional<Membership> findByTransactionId(String transactionId);
}
