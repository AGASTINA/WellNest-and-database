package com.wellnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDto {
    private Long id;
    private String name;
    private String specialization;
    private String qualification;
    private Integer experienceYears;
    private String about;
    private String email;
    private String phoneNumber;
    private Double consultationFee;
    private String languages;
    private String hospitalName;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    private Double latitude;
    private Double longitude;
    private String availabilityDays;
    private String availabilityHours;
    private Double rating;
    private Integer totalReviews;
    private String profileImageUrl;
    private Boolean isAvailable;
    private Double distance; // Will be calculated for location-based search
}
