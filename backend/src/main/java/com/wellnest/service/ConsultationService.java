package com.wellnest.service;

import com.wellnest.dto.ConsultationDto;
import com.wellnest.dto.ConsultationRequest;
import com.wellnest.entity.Consultation;
import com.wellnest.entity.Doctor;
import com.wellnest.entity.User;
import com.wellnest.repository.ConsultationRepository;
import com.wellnest.repository.DoctorRepository;
import com.wellnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    @Transactional
    @SuppressWarnings("null")
    public ConsultationDto bookConsultation(Long userId, ConsultationRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Consultation consultation = new Consultation();
        consultation.setUser(user);
        consultation.setDoctor(doctor);
        consultation.setConsultationType(request.getConsultationType());
        consultation.setScheduledAt(request.getScheduledAt());
        consultation.setSymptoms(request.getSymptoms());
        consultation.setNotes(request.getNotes());
        consultation.setConsultationFee(doctor.getConsultationFee());
        consultation.setStatus("SCHEDULED");
        consultation.setPaymentStatus("PENDING");

        Consultation saved = consultationRepository.save(consultation);
        return convertToDto(saved);
    }

    public List<ConsultationDto> getUserConsultations(Long userId) {
        return consultationRepository.findByUserIdOrderByScheduledAtDesc(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<ConsultationDto> getUserConsultationsByStatus(Long userId, String status) {
        return consultationRepository.findByUserIdAndStatus(userId, status)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @SuppressWarnings("null")
    public ConsultationDto getConsultationById(Long id) {
        Consultation consultation = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));
        return convertToDto(consultation);
    }

    @Transactional
    @SuppressWarnings("null")
    public ConsultationDto updateConsultationStatus(Long id, String status) {
        Consultation consultation = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));
        
        consultation.setStatus(status);
        Consultation updated = consultationRepository.save(consultation);
        return convertToDto(updated);
    }

    @Transactional
    public ConsultationDto cancelConsultation(Long id) {
        return updateConsultationStatus(id, "CANCELLED");
    }

    @Transactional
    @SuppressWarnings("null")
    public ConsultationDto completeConsultation(Long id, String diagnosis, String prescription) {
        Consultation consultation = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));
        
        consultation.setStatus("COMPLETED");
        consultation.setDiagnosis(diagnosis);
        consultation.setPrescription(prescription);
        
        Consultation updated = consultationRepository.save(consultation);
        return convertToDto(updated);
    }

    private ConsultationDto convertToDto(Consultation consultation) {
        ConsultationDto dto = new ConsultationDto();
        dto.setId(consultation.getId());
        dto.setUserId(consultation.getUser().getId());
        dto.setDoctorId(consultation.getDoctor().getId());
        dto.setDoctorName(consultation.getDoctor().getName());
        dto.setDoctorSpecialization(consultation.getDoctor().getSpecialization());
        dto.setConsultationType(consultation.getConsultationType());
        dto.setScheduledAt(consultation.getScheduledAt());
        dto.setStatus(consultation.getStatus());
        dto.setSymptoms(consultation.getSymptoms());
        dto.setNotes(consultation.getNotes());
        dto.setPrescription(consultation.getPrescription());
        dto.setDiagnosis(consultation.getDiagnosis());
        dto.setConsultationFee(consultation.getConsultationFee());
        dto.setPaymentStatus(consultation.getPaymentStatus());
        return dto;
    }
}
