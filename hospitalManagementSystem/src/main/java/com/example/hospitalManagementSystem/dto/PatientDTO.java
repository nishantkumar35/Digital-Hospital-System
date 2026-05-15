package com.example.hospitalManagementSystem.dto;

import lombok.Data;

@Data
public class PatientDTO {
    private Long id;
    private String name;
    private Integer age;
    private String gender;
    private String phone;
    private String address;
    private Long assignedDoctorId; // Only ID to avoid nesting too deep initially
    private String assignedDoctorName;
}
