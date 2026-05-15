package com.example.hospitalManagementSystem.dto;

import lombok.Data;
import java.util.List;

@Data
public class CreateReceiptDTO {
    private Long patientId;
    private String disease;
    private String symptoms;
    private String remedy;
    private List<AddMedicineToReceiptDTO> medicines;
}
