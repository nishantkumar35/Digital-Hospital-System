package com.example.hospitalManagementSystem.service;

import com.example.hospitalManagementSystem.dto.DoctorDTO;
import com.example.hospitalManagementSystem.entity.Doctor;
import com.example.hospitalManagementSystem.exception.ResourceNotFoundException;
import com.example.hospitalManagementSystem.repository.DoctorRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    public DoctorDTO createDoctor(DoctorDTO doctorDTO) {
        Doctor doctor = new Doctor();
        BeanUtils.copyProperties(doctorDTO, doctor);
        Doctor savedDoctor = doctorRepository.save(doctor);
        DoctorDTO savedDTO = new DoctorDTO();
        BeanUtils.copyProperties(savedDoctor, savedDTO);
        return savedDTO;
    }

    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll().stream().map(doctor -> {
            DoctorDTO dto = new DoctorDTO();
            BeanUtils.copyProperties(doctor, dto);
            return dto;
        }).collect(Collectors.toList());
    }

    public DoctorDTO getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        DoctorDTO dto = new DoctorDTO();
        BeanUtils.copyProperties(doctor, dto);
        return dto;
    }

    public DoctorDTO updateDoctor(Long id, DoctorDTO doctorDTO) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        doctor.setName(doctorDTO.getName());
        doctor.setSpecialization(doctorDTO.getSpecialization());
        doctor.setPhone(doctorDTO.getPhone());
        doctor.setEmail(doctorDTO.getEmail());

        Doctor updatedDoctor = doctorRepository.save(doctor);
        DoctorDTO savedDTO = new DoctorDTO();
        BeanUtils.copyProperties(updatedDoctor, savedDTO);
        return savedDTO;
    }

    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        doctorRepository.delete(doctor);
    }
}
