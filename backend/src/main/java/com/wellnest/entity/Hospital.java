package com.wellnest.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "hospitals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "hospital_type", nullable = false)
    private String hospitalType; // GENERAL, SPECIALTY, CLINIC, etc.

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String email;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "emergency_number")
    private String emergencyNumber;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(name = "zip_code")
    private String zipCode;

    private String country;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(columnDefinition = "TEXT")
    private String facilities; // ICU, Emergency, Operation Theater, etc.

    @Column(columnDefinition = "TEXT")
    private String specialties; // Cardiology, Neurology, Orthopedics, etc.

    @Column(name = "bed_capacity")
    private Integer bedCapacity;

    @Column(name = "has_emergency", nullable = false)
    private Boolean hasEmergency = true;

    @Column(name = "has_ambulance", nullable = false)
    private Boolean hasAmbulance = true;

    @Column(name = "has_parking", nullable = false)
    private Boolean hasParking = true;

    @Column(name = "operating_hours")
    private String operatingHours; // e.g., "24/7" or "08:00-20:00"

    private Double rating;

    @Column(name = "total_reviews")
    private Integer totalReviews;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "website_url")
    private String websiteUrl;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isActive == null) {
            isActive = true;
        }
        if (hasEmergency == null) {
            hasEmergency = true;
        }
        if (hasAmbulance == null) {
            hasAmbulance = false;
        }
        if (hasParking == null) {
            hasParking = true;
        }
        if (rating == null) {
            rating = 0.0;
        }
        if (totalReviews == null) {
            totalReviews = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
