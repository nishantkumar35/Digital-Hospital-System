package com.example.hospitalManagementSystem.service;

import com.example.hospitalManagementSystem.dto.MedicineDTO;
import com.example.hospitalManagementSystem.entity.Medicine;
import com.example.hospitalManagementSystem.exception.ResourceNotFoundException;
import com.example.hospitalManagementSystem.repository.MedicineRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicineService {

    @Autowired
    private MedicineRepository medicineRepository;

    public MedicineDTO createMedicine(MedicineDTO medicineDTO) {
        Medicine medicine = new Medicine();
        BeanUtils.copyProperties(medicineDTO, medicine);
        Medicine savedMedicine = medicineRepository.save(medicine);
        MedicineDTO savedDTO = new MedicineDTO();
        BeanUtils.copyProperties(savedMedicine, savedDTO);
        return savedDTO;
    }

    public List<MedicineDTO> getAllMedicines() {
        return medicineRepository.findAll().stream().map(medicine -> {
            MedicineDTO dto = new MedicineDTO();
            BeanUtils.copyProperties(medicine, dto);
            return dto;
        }).collect(Collectors.toList());
    }

    public MedicineDTO getMedicineById(Long id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + id));
        MedicineDTO dto = new MedicineDTO();
        BeanUtils.copyProperties(medicine, dto);
        return dto;
    }

    public MedicineDTO updateMedicine(Long id, MedicineDTO medicineDTO) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + id));

        medicine.setName(medicineDTO.getName());
        medicine.setDescription(medicineDTO.getDescription());
        medicine.setPrice(medicineDTO.getPrice());
        medicine.setStockQuantity(medicineDTO.getStockQuantity());

        Medicine updatedMedicine = medicineRepository.save(medicine);
        MedicineDTO savedDTO = new MedicineDTO();
        BeanUtils.copyProperties(updatedMedicine, savedDTO);
        return savedDTO;
    }

    public void deleteMedicine(Long id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + id));
        medicineRepository.delete(medicine);
    }
}
