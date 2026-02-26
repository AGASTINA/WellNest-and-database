package com.wellnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HospitalDto {
    private Long id;
    private String name;
    private String hospitalType;
    private String description;
    private String email;
    private String phoneNumber;
    private String emergencyNumber;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    private Double latitude;
    private Double longitude;
    private String facilities;
    private String specialties;
    private Integer bedCapacity;
    private Boolean hasEmergency;
    private Boolean hasAmbulance;
    private Boolean hasParking;
    private String operatingHours;
    private Double rating;
    private Integer totalReviews;
    private String imageUrl;
    private String websiteUrl;
    private Boolean isActive;
    private Double distance; // Will be calculated for location-based search
}
