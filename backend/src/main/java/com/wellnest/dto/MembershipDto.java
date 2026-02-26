package com.wellnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MembershipDto {
    private Long id;
    private Long userId;
    private String planType;
    private String planName;
    private Double price;
    private String billingCycle;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
    private String paymentStatus;
    private String transactionId;
    private String paymentMethod;
    private Boolean autoRenewal;
    private String features;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
