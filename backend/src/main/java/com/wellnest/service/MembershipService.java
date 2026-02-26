package com.wellnest.service;

import com.wellnest.dto.MembershipDto;
import com.wellnest.entity.Membership;
import com.wellnest.entity.User;
import com.wellnest.repository.MembershipRepository;
import com.wellnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MembershipService {

    private final MembershipRepository membershipRepository;
    private final UserRepository userRepository;

    @Transactional
    @SuppressWarnings("null")
    public MembershipDto createMembership(Long userId, MembershipDto membershipDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user already has an active membership
        List<Membership> existing = membershipRepository.findByUserIdOrderByCreatedAtDesc(userId);
        for (Membership m : existing) {
            if ("ACTIVE".equals(m.getStatus())) {
                throw new RuntimeException("User already has an active membership");
            }
        }

        Membership membership = new Membership();
        membership.setUser(user);
        membership.setPlanType(membershipDto.getPlanType());
        membership.setPlanName(getPlanName(membershipDto.getPlanType()));
        membership.setBillingCycle(membershipDto.getBillingCycle());
        membership.setPrice(calculatePrice(membershipDto.getPlanType(), membershipDto.getBillingCycle()));
        membership.setStartDate(LocalDateTime.now());
        membership.setEndDate(calculateEndDate(membershipDto.getBillingCycle()));
        membership.setStatus("PENDING");
        membership.setAutoRenewal(membershipDto.getAutoRenewal() != null ? membershipDto.getAutoRenewal() : true);
        
        String transactionId = generateTransactionId();
        membership.setTransactionId(transactionId);

        Membership saved = membershipRepository.save(membership);
        return convertToDto(saved);
    }

    public MembershipDto getUserActiveMembership(Long userId) {
        List<Membership> memberships = membershipRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return memberships.stream()
                .filter(m -> "ACTIVE".equals(m.getStatus()))
                .map(this::convertToDto)
                .findFirst()
                .orElse(null);
    }

    public List<MembershipDto> getUserMembershipHistory(Long userId) {
        return membershipRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    @SuppressWarnings("null")
    public MembershipDto processPayment(String transactionId, String paymentMethod, String paymentStatus) {
        Membership membership = membershipRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new RuntimeException("Membership not found for transaction"));

        membership.setPaymentMethod(paymentMethod);
        membership.setPaymentStatus(paymentStatus);
        
        if ("COMPLETED".equals(paymentStatus)) {
            membership.setStatus("ACTIVE");
        } else if ("FAILED".equals(paymentStatus)) {
            membership.setStatus("CANCELLED");
        }

        Membership updated = membershipRepository.save(membership);
        return convertToDto(updated);
    }

    @Transactional
    @SuppressWarnings("null")
    public MembershipDto upgradeMembership(Long userId, String newPlanType) {
        List<Membership> memberships = membershipRepository.findByUserIdOrderByCreatedAtDesc(userId);
        Membership current = memberships.stream()
                .filter(m -> "ACTIVE".equals(m.getStatus()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No active membership found"));

        current.setStatus("UPGRADED");
        membershipRepository.save(current);

        MembershipDto newMembership = new MembershipDto();
        newMembership.setPlanType(newPlanType);
        newMembership.setBillingCycle(current.getBillingCycle());
        newMembership.setAutoRenewal(current.getAutoRenewal());

        return createMembership(userId, newMembership);
    }

    @Transactional
    @SuppressWarnings("null")
    public void cancelMembership(Long membershipId) {
        Membership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new RuntimeException("Membership not found"));

        membership.setStatus("CANCELLED");
        membership.setAutoRenewal(false);
        membershipRepository.save(membership);
    }

    private double calculatePrice(String planType, String billingCycle) {
        double monthlyPrice;
        switch (planType) {
            case "FREE": return 0.0;
            case "BASIC": monthlyPrice = 9.99; break;
            case "PREMIUM": monthlyPrice = 19.99; break;
            case "ENTERPRISE": monthlyPrice = 49.99; break;
            default: monthlyPrice = 0.0;
        }

        switch (billingCycle) {
            case "MONTHLY": return monthlyPrice;
            case "QUARTERLY": return monthlyPrice * 3 * 0.9; // 10% discount
            case "YEARLY": return monthlyPrice * 12 * 0.8; // 20% discount
            default: return monthlyPrice;
        }
    }

    private LocalDateTime calculateEndDate(String billingCycle) {
        LocalDateTime now = LocalDateTime.now();
        switch (billingCycle) {
            case "MONTHLY": return now.plusMonths(1);
            case "QUARTERLY": return now.plusMonths(3);
            case "YEARLY": return now.plusYears(1);
            default: return now.plusMonths(1);
        }
    }

    private String generateTransactionId() {
        return "TXN-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }

    private String getPlanName(String planType) {
        switch (planType) {
            case "FREE": return "Free Plan";
            case "BASIC": return "Basic Plan";
            case "PREMIUM": return "Premium Plan";
            case "ENTERPRISE": return "Enterprise Plan";
            default: return "Unknown Plan";
        }
    }

    private MembershipDto convertToDto(Membership membership) {
        MembershipDto dto = new MembershipDto();
        dto.setId(membership.getId());
        dto.setUserId(membership.getUser().getId());
        dto.setPlanType(membership.getPlanType());
        dto.setPlanName(membership.getPlanName());
        dto.setBillingCycle(membership.getBillingCycle());
        dto.setPrice(membership.getPrice());
        dto.setStartDate(membership.getStartDate());
        dto.setEndDate(membership.getEndDate());
        dto.setStatus(membership.getStatus());
        dto.setPaymentMethod(membership.getPaymentMethod());
        dto.setPaymentStatus(membership.getPaymentStatus());
        dto.setTransactionId(membership.getTransactionId());
        dto.setAutoRenewal(membership.getAutoRenewal());
        dto.setCreatedAt(membership.getCreatedAt());
        dto.setUpdatedAt(membership.getUpdatedAt());
        return dto;
    }
}
