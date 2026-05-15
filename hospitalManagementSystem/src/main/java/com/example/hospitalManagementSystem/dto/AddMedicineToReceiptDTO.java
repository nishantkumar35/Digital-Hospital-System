package com.example.hospitalManagementSystem.dto;

import lombok.Data;

@Data
public class AddMedicineToReceiptDTO {
    private Long medicineId;
    private Integer quantity;
}
