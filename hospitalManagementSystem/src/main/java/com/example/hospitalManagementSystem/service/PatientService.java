package com.example.hospitalManagementSystem.service;

import com.example.hospitalManagementSystem.dto.PatientDTO;
import com.example.hospitalManagementSystem.entity.Doctor;
import com.example.hospitalManagementSystem.entity.Patient;
import com.example.hospitalManagementSystem.exception.ResourceNotFoundException;
import com.example.hospitalManagementSystem.repository.DoctorRepository;
import com.example.hospitalManagementSystem.repository.PatientRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    public PatientDTO createPatient(PatientDTO patientDTO) {
        Patient patient = new Patient();
        BeanUtils.copyProperties(patientDTO, patient);

        if (patientDTO.getAssignedDoctorId() != null) {
            Doctor doctor = doctorRepository.findById(patientDTO.getAssignedDoctorId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Doctor not found with id: " + patientDTO.getAssignedDoctorId()));
            patient.setAssignedDoctor(doctor);
        }

        Patient savedPatient = patientRepository.save(patient);
        return convertToDTO(savedPatient);
    }

    public List<PatientDTO> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PatientDTO getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        return convertToDTO(patient);
    }

    public PatientDTO updatePatient(Long id, PatientDTO patientDTO) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));

        patient.setName(patientDTO.getName());
        patient.setAge(patientDTO.getAge());
        patient.setGender(patientDTO.getGender());
        patient.setPhone(patientDTO.getPhone());
        patient.setAddress(patientDTO.getAddress());

        if (patientDTO.getAssignedDoctorId() != null) {
            Doctor doctor = doctorRepository.findById(patientDTO.getAssignedDoctorId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Doctor not found with id: " + patientDTO.getAssignedDoctorId()));
            patient.setAssignedDoctor(doctor);
        } else {
            patient.setAssignedDoctor(null);
        }

        Patient updatedPatient = patientRepository.save(patient);
        return convertToDTO(updatedPatient);
    }

    public void deletePatient(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        patientRepository.delete(patient);
    }

    private PatientDTO convertToDTO(Patient patient) {
        PatientDTO dto = new PatientDTO();
        BeanUtils.copyProperties(patient, dto);
        if (patient.getAssignedDoctor() != null) {
            dto.setAssignedDoctorId(patient.getAssignedDoctor().getId());
            dto.setAssignedDoctorName(patient.getAssignedDoctor().getName());
        }
        return dto;
    }
}
