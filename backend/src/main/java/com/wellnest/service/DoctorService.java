package com.wellnest.service;

import com.wellnest.dto.DoctorDto;
import com.wellnest.entity.Doctor;
import com.wellnest.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public List<DoctorDto> getAllAvailableDoctors() {
        return doctorRepository.findByIsAvailableTrue()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    @SuppressWarnings("null")    public DoctorDto getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return convertToDto(doctor);
    }

    public List<DoctorDto> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecializationAndIsAvailableTrue(specialization)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<DoctorDto> searchDoctors(String keyword) {
        return doctorRepository.searchDoctors(keyword)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<DoctorDto> findNearbyDoctors(Double userLat, Double userLon, Double radiusKm) {
        List<Doctor> allDoctors = doctorRepository.findByIsAvailableTrue();
        List<DoctorDto> nearbyDoctors = new ArrayList<>();

        for (Doctor doctor : allDoctors) {
            double distance = calculateDistance(userLat, userLon, 
                                               doctor.getLatitude(), doctor.getLongitude());
            if (distance <= radiusKm) {
                DoctorDto dto = convertToDto(doctor);
                dto.setDistance(Math.round(distance * 100.0) / 100.0);
                nearbyDoctors.add(dto);
            }
        }

        // Sort by distance
        nearbyDoctors.sort(Comparator.comparing(DoctorDto::getDistance));
        return nearbyDoctors;
    }

    public List<DoctorDto> findNearbyDoctorsBySpecialization(Double userLat, Double userLon, 
                                                              Double radiusKm, String specialization) {
        List<Doctor> allDoctors = doctorRepository.findBySpecializationAndIsAvailableTrue(specialization);
        List<DoctorDto> nearbyDoctors = new ArrayList<>();

        for (Doctor doctor : allDoctors) {
            double distance = calculateDistance(userLat, userLon, 
                                               doctor.getLatitude(), doctor.getLongitude());
            if (distance <= radiusKm) {
                DoctorDto dto = convertToDto(doctor);
                dto.setDistance(Math.round(distance * 100.0) / 100.0);
                nearbyDoctors.add(dto);
            }
        }

        nearbyDoctors.sort(Comparator.comparing(DoctorDto::getDistance));
        return nearbyDoctors;
    }

    // Haversine formula to calculate distance between two coordinates
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS_KM = 6371;

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_KM * c;
    }

    private DoctorDto convertToDto(Doctor doctor) {
        DoctorDto dto = new DoctorDto();
        dto.setId(doctor.getId());
        dto.setName(doctor.getName());
        dto.setSpecialization(doctor.getSpecialization());
        dto.setQualification(doctor.getQualification());
        dto.setExperienceYears(doctor.getExperienceYears());
        dto.setAbout(doctor.getAbout());
        dto.setEmail(doctor.getEmail());
        dto.setPhoneNumber(doctor.getPhoneNumber());
        dto.setConsultationFee(doctor.getConsultationFee());
        dto.setLanguages(doctor.getLanguages());
        dto.setHospitalName(doctor.getHospitalName());
        dto.setAddress(doctor.getAddress());
        dto.setCity(doctor.getCity());
        dto.setState(doctor.getState());
        dto.setZipCode(doctor.getZipCode());
        dto.setCountry(doctor.getCountry());
        dto.setLatitude(doctor.getLatitude());
        dto.setLongitude(doctor.getLongitude());
        dto.setAvailabilityDays(doctor.getAvailabilityDays());
        dto.setAvailabilityHours(doctor.getAvailabilityHours());
        dto.setRating(doctor.getRating());
        dto.setTotalReviews(doctor.getTotalReviews());
        dto.setProfileImageUrl(doctor.getProfileImageUrl());
        dto.setIsAvailable(doctor.getIsAvailable());
        return dto;
    }
}
