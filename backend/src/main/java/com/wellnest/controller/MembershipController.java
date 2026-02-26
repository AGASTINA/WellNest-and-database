package com.wellnest.controller;

import com.wellnest.dto.MembershipDto;
import com.wellnest.service.MembershipService;
import com.wellnest.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/memberships")
@RequiredArgsConstructor
public class MembershipController {

    private final MembershipService membershipService;
    private final UserService userService;

    @PostMapping
    @SuppressWarnings("null")
    public ResponseEntity<?> createMembership(@RequestBody MembershipDto membershipDto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserProfile(email).getId();
        
        try {
            MembershipDto created = membershipService.createMembership(userId, membershipDto);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("already has an active")) {
                return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            }
            throw e;
        }
    }

    @GetMapping("/active")
    @SuppressWarnings("null")
    public ResponseEntity<MembershipDto> getActiveMembership() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserProfile(email).getId();
        
        MembershipDto membership = membershipService.getUserActiveMembership(userId);
        if (membership == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(membership);
    }

    @GetMapping("/history")
    @SuppressWarnings("null")
    public ResponseEntity<List<MembershipDto>> getMembershipHistory() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserProfile(email).getId();
        
        List<MembershipDto> history = membershipService.getUserMembershipHistory(userId);
        return ResponseEntity.ok(history);
    }

    @PostMapping("/payment/process")
    public ResponseEntity<MembershipDto> processPayment(@RequestBody Map<String, String> paymentData) {
        String transactionId = paymentData.get("transactionId");
        String paymentMethod = paymentData.get("paymentMethod");
        String paymentStatus = paymentData.get("paymentStatus");
        
        MembershipDto updated = membershipService.processPayment(transactionId, paymentMethod, paymentStatus);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/upgrade")
    @SuppressWarnings("null")
    public ResponseEntity<MembershipDto> upgradeMembership(@RequestBody Map<String, String> upgradeData) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserProfile(email).getId();
        String newPlanType = upgradeData.get("planType");
        
        MembershipDto upgraded = membershipService.upgradeMembership(userId, newPlanType);
        return ResponseEntity.ok(upgraded);
    }

    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelMembership(@PathVariable Long id) {
        membershipService.cancelMembership(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/plans")
    public ResponseEntity<Map<String, Map<String, Object>>> getPlans() {
        // Return plan details for frontend to display
        return ResponseEntity.ok(Map.of(
            "FREE", Map.of(
                "name", "Free Plan",
                "price", 0.0,
                "features", List.of("Basic workout tracking", "Limited medical records", "Community support")
            ),
            "BASIC", Map.of(
                "name", "Basic Plan",
                "monthlyPrice", 9.99,
                "features", List.of("Unlimited workouts", "Full medical records", "Email support", "Progress analytics")
            ),
            "PREMIUM", Map.of(
                "name", "Premium Plan",
                "monthlyPrice", 19.99,
                "features", List.of("All Basic features", "Personalized meal plans", "Doctor consultations", "Priority support", "Advanced analytics")
            ),
            "ENTERPRISE", Map.of(
                "name", "Enterprise Plan",
                "monthlyPrice", 49.99,
                "features", List.of("All Premium features", "Dedicated health coach", "Custom integrations", "Team management", "24/7 support")
            )
        ));
    }
}
