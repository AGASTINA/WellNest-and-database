package com.wellnest.service;

import com.wellnest.dto.MedicalRecordDto;
import com.wellnest.entity.MedicalRecord;
import com.wellnest.entity.User;
import com.wellnest.repository.MedicalRecordRepository;
import com.wellnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final UserRepository userRepository;

    @Transactional    @SuppressWarnings("null")    public MedicalRecordDto createMedicalRecord(Long userId, MedicalRecordDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        MedicalRecord record = new MedicalRecord();
        record.setUser(user);
        record.setRecordType(dto.getRecordType());
        record.setTitle(dto.getTitle());
        record.setDescription(dto.getDescription());
        record.setDoctorName(dto.getDoctorName());
        record.setHospitalName(dto.getHospitalName());
        record.setDiagnosis(dto.getDiagnosis());
        record.setMedications(dto.getMedications());
        record.setAllergies(dto.getAllergies());
        record.setBloodType(dto.getBloodType());
        record.setChronic_conditions(dto.getChronicConditions());
        record.setRecordDate(dto.getRecordDate());

        MedicalRecord saved = medicalRecordRepository.save(record);
        return convertToDto(saved);
    }

    public List<MedicalRecordDto> getUserMedicalRecords(Long userId) {
        return medicalRecordRepository.findByUserIdOrderByRecordDateDesc(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<MedicalRecordDto> getUserMedicalRecordsByType(Long userId, String recordType) {
        return medicalRecordRepository.findByUserIdAndRecordType(userId, recordType)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    @SuppressWarnings("null")
    public MedicalRecordDto getMedicalRecordById(Long id) {
        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical record not found"));
        return convertToDto(record);
    }

    @Transactional
    @SuppressWarnings("null")
    public MedicalRecordDto updateMedicalRecord(Long id, MedicalRecordDto dto) {
        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical record not found"));

        if (dto.getTitle() != null) record.setTitle(dto.getTitle());
        if (dto.getDescription() != null) record.setDescription(dto.getDescription());
        if (dto.getDoctorName() != null) record.setDoctorName(dto.getDoctorName());
        if (dto.getHospitalName() != null) record.setHospitalName(dto.getHospitalName());
        if (dto.getDiagnosis() != null) record.setDiagnosis(dto.getDiagnosis());
        if (dto.getMedications() != null) record.setMedications(dto.getMedications());
        if (dto.getAllergies() != null) record.setAllergies(dto.getAllergies());
        if (dto.getBloodType() != null) record.setBloodType(dto.getBloodType());
        if (dto.getChronicConditions() != null) record.setChronic_conditions(dto.getChronicConditions());

        MedicalRecord updated = medicalRecordRepository.save(record);
        return convertToDto(updated);
    }

    @Transactional
    @SuppressWarnings("null")
    public void deleteMedicalRecord(Long id) {
        medicalRecordRepository.deleteById(id);
    }

    private MedicalRecordDto convertToDto(MedicalRecord record) {
        MedicalRecordDto dto = new MedicalRecordDto();
        dto.setId(record.getId());
        dto.setUserId(record.getUser().getId());
        dto.setRecordType(record.getRecordType());
        dto.setTitle(record.getTitle());
        dto.setDescription(record.getDescription());
        dto.setDoctorName(record.getDoctorName());
        dto.setHospitalName(record.getHospitalName());
        dto.setDiagnosis(record.getDiagnosis());
        dto.setMedications(record.getMedications());
        dto.setAllergies(record.getAllergies());
        dto.setBloodType(record.getBloodType());
        dto.setChronicConditions(record.getChronic_conditions());
        dto.setRecordDate(record.getRecordDate());
        dto.setCreatedAt(record.getCreatedAt());
        return dto;
    }
}
