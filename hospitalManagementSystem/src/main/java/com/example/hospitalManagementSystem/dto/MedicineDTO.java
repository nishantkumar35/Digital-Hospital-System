package com.example.hospitalManagementSystem.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class MedicineDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
}
