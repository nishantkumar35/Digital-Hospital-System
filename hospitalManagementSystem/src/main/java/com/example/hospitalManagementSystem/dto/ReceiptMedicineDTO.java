package com.example.hospitalManagementSystem.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ReceiptMedicineDTO {
    private Long medicineId;
    private String medicineName;
    private Integer quantity;
    private BigDecimal priceAtPurchase;
}
