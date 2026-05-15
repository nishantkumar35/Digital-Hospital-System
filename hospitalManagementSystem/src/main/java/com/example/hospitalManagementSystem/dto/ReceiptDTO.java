package com.example.hospitalManagementSystem.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ReceiptDTO {
    private Long id;
    private Long patientId;
    private String patientName;
    private String disease;
    private String symptoms;
    private String remedy;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    private List<ReceiptMedicineDTO> medicines;
}
