package com.wellnest.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "memberships")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Membership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "plan_type", nullable = false)
    private String planType; // FREE, BASIC, PREMIUM, ENTERPRISE

    @Column(name = "plan_name")
    private String planName;

    @Column(name = "price", nullable = false)
    private Double price;

    @Column(name = "billing_cycle", nullable = false)
    private String billingCycle; // MONTHLY, QUARTERLY, YEARLY

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "status", nullable = false)
    private String status; // ACTIVE, EXPIRED, CANCELLED, SUSPENDED

    @Column(name = "payment_status")
    private String paymentStatus; // PAID, PENDING, FAILED, REFUNDED

    @Column(name = "transaction_id")
    private String transactionId;

    @Column(name = "payment_method")
    private String paymentMethod; // CREDIT_CARD, DEBIT_CARD, UPI, NET_BANKING, PAYPAL

    @Column(name = "auto_renewal")
    private Boolean autoRenewal;

    @Column(name = "features", columnDefinition = "TEXT")
    private String features; // JSON string of features

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (autoRenewal == null) {
            autoRenewal = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
