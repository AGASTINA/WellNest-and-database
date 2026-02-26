package com.wellnest.service;

import com.wellnest.dto.HospitalDto;
import com.wellnest.entity.Hospital;
import com.wellnest.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HospitalService {

    private final HospitalRepository hospitalRepository;

    public List<HospitalDto> getAllActiveHospitals() {
        return hospitalRepository.findByIsActiveTrue()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    @SuppressWarnings("null")    public HospitalDto getHospitalById(Long id) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hospital not found"));
        return convertToDto(hospital);
    }

    public List<HospitalDto> searchHospitals(String keyword) {
        return hospitalRepository.searchHospitals(keyword)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<HospitalDto> findNearbyHospitals(Double userLat, Double userLon, Double radiusKm) {
        List<Hospital> allHospitals = hospitalRepository.findByIsActiveTrue();
        List<HospitalDto> nearbyHospitals = new ArrayList<>();

        for (Hospital hospital : allHospitals) {
            double distance = calculateDistance(userLat, userLon, 
                                               hospital.getLatitude(), hospital.getLongitude());
            if (distance <= radiusKm) {
                HospitalDto dto = convertToDto(hospital);
                dto.setDistance(Math.round(distance * 100.0) / 100.0);
                nearbyHospitals.add(dto);
            }
        }

        nearbyHospitals.sort(Comparator.comparing(HospitalDto::getDistance));
        return nearbyHospitals;
    }

    public List<HospitalDto> findNearbyEmergencyHospitals(Double userLat, Double userLon, Double radiusKm) {
        List<Hospital> allHospitals = hospitalRepository.findByIsActiveTrue();
        List<HospitalDto> nearbyHospitals = new ArrayList<>();

        for (Hospital hospital : allHospitals) {
            if (hospital.getHasEmergency()) {
                double distance = calculateDistance(userLat, userLon, 
                                                   hospital.getLatitude(), hospital.getLongitude());
                if (distance <= radiusKm) {
                    HospitalDto dto = convertToDto(hospital);
                    dto.setDistance(Math.round(distance * 100.0) / 100.0);
                    nearbyHospitals.add(dto);
                }
            }
        }

        nearbyHospitals.sort(Comparator.comparing(HospitalDto::getDistance));
        return nearbyHospitals;
    }

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

    private HospitalDto convertToDto(Hospital hospital) {
        HospitalDto dto = new HospitalDto();
        dto.setId(hospital.getId());
        dto.setName(hospital.getName());
        dto.setHospitalType(hospital.getHospitalType());
        dto.setDescription(hospital.getDescription());
        dto.setEmail(hospital.getEmail());
        dto.setPhoneNumber(hospital.getPhoneNumber());
        dto.setEmergencyNumber(hospital.getEmergencyNumber());
        dto.setAddress(hospital.getAddress());
        dto.setCity(hospital.getCity());
        dto.setState(hospital.getState());
        dto.setZipCode(hospital.getZipCode());
        dto.setCountry(hospital.getCountry());
        dto.setLatitude(hospital.getLatitude());
        dto.setLongitude(hospital.getLongitude());
        dto.setFacilities(hospital.getFacilities());
        dto.setSpecialties(hospital.getSpecialties());
        dto.setBedCapacity(hospital.getBedCapacity());
        dto.setHasEmergency(hospital.getHasEmergency());
        dto.setHasAmbulance(hospital.getHasAmbulance());
        dto.setHasParking(hospital.getHasParking());
        dto.setOperatingHours(hospital.getOperatingHours());
        dto.setRating(hospital.getRating());
        dto.setTotalReviews(hospital.getTotalReviews());
        dto.setImageUrl(hospital.getImageUrl());
        dto.setWebsiteUrl(hospital.getWebsiteUrl());
        dto.setIsActive(hospital.getIsActive());
        return dto;
    }
}
