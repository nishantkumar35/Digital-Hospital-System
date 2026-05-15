package com.example.hospitalManagementSystem.service;

import com.example.hospitalManagementSystem.dto.AddMedicineToReceiptDTO;
import com.example.hospitalManagementSystem.dto.CreateReceiptDTO;
import com.example.hospitalManagementSystem.dto.ReceiptDTO;
import com.example.hospitalManagementSystem.dto.ReceiptMedicineDTO;
import com.example.hospitalManagementSystem.entity.*;
import com.example.hospitalManagementSystem.exception.InsufficientStockException;
import com.example.hospitalManagementSystem.exception.ResourceNotFoundException;
import com.example.hospitalManagementSystem.repository.MedicineRepository;
import com.example.hospitalManagementSystem.repository.PatientRepository;
import com.example.hospitalManagementSystem.repository.ReceiptMedicineRepository;
import com.example.hospitalManagementSystem.repository.ReceiptRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReceiptService {

    @Autowired
    private ReceiptRepository receiptRepository;

    @Autowired
    private ReceiptMedicineRepository receiptMedicineRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Transactional
    public ReceiptDTO createReceipt(CreateReceiptDTO createReceiptDTO) {
        Patient patient = patientRepository.findById(createReceiptDTO.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Patient not found with id: " + createReceiptDTO.getPatientId()));

        Receipt receipt = new Receipt();
        receipt.setPatient(patient);
        receipt.setDisease(createReceiptDTO.getDisease());
        receipt.setSymptoms(createReceiptDTO.getSymptoms());
        receipt.setRemedy(createReceiptDTO.getRemedy());
        receipt.setTotalAmount(BigDecimal.ZERO); // Initial total

        Receipt savedReceipt = receiptRepository.save(receipt);

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<ReceiptMedicineDTO> medicineDTOs = new ArrayList<>();

        if (createReceiptDTO.getMedicines() != null) {
            for (AddMedicineToReceiptDTO medicineItem : createReceiptDTO.getMedicines()) {
                Medicine medicine = medicineRepository.findById(medicineItem.getMedicineId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Medicine not found with id: " + medicineItem.getMedicineId()));

                if (medicine.getStockQuantity() < medicineItem.getQuantity()) {
                    throw new InsufficientStockException("Insufficient stock for medicine: " + medicine.getName());
                }

                // Reduce stock
                medicine.setStockQuantity(medicine.getStockQuantity() - medicineItem.getQuantity());
                medicineRepository.save(medicine);

                // Add to ReceiptMedicine
                ReceiptMedicine receiptMedicine = new ReceiptMedicine();
                receiptMedicine.setReceipt(savedReceipt);
                receiptMedicine.setMedicine(medicine);
                receiptMedicine.setQuantity(medicineItem.getQuantity());
                receiptMedicine.setPriceAtPurchase(medicine.getPrice());

                receiptMedicineRepository.save(receiptMedicine);

                BigDecimal lineTotal = medicine.getPrice().multiply(BigDecimal.valueOf(medicineItem.getQuantity()));
                totalAmount = totalAmount.add(lineTotal);

                // For response
                ReceiptMedicineDTO rmDTO = new ReceiptMedicineDTO();
                rmDTO.setMedicineId(medicine.getId());
                rmDTO.setMedicineName(medicine.getName());
                rmDTO.setQuantity(medicineItem.getQuantity());
                rmDTO.setPriceAtPurchase(medicine.getPrice());
                medicineDTOs.add(rmDTO);
            }
        }

        savedReceipt.setTotalAmount(totalAmount);
        Receipt finalReceipt = receiptRepository.save(savedReceipt);

        ReceiptDTO receiptDTO = new ReceiptDTO();
        BeanUtils.copyProperties(finalReceipt, receiptDTO);
        receiptDTO.setPatientId(patient.getId());
        receiptDTO.setPatientName(patient.getName());
        receiptDTO.setMedicines(medicineDTOs);

        return receiptDTO;
    }

    public List<ReceiptDTO> getReceiptsByPatientId(Long patientId) {
        List<Receipt> receipts = receiptRepository.findByPatientId(patientId);
        return receipts.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public ReceiptDTO getReceiptById(Long id) {
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt not found with id: " + id));
        return convertToDTO(receipt);
    }

    private ReceiptDTO convertToDTO(Receipt receipt) {
        ReceiptDTO dto = new ReceiptDTO();
        BeanUtils.copyProperties(receipt, dto);
        dto.setPatientId(receipt.getPatient().getId());
        dto.setPatientName(receipt.getPatient().getName());

        List<ReceiptMedicine> receiptMedicines = receiptMedicineRepository.findByReceiptId(receipt.getId());
        List<ReceiptMedicineDTO> medicineDTOs = receiptMedicines.stream().map(rm -> {
            ReceiptMedicineDTO rmDTO = new ReceiptMedicineDTO();
            rmDTO.setMedicineId(rm.getMedicine().getId());
            rmDTO.setMedicineName(rm.getMedicine().getName());
            rmDTO.setQuantity(rm.getQuantity());
            rmDTO.setPriceAtPurchase(rm.getPriceAtPurchase());
            return rmDTO;
        }).collect(Collectors.toList());

        dto.setMedicines(medicineDTOs);
        return dto;
    }
}
