package com.example.hospitalManagementSystem.dto;

import lombok.Data;

@Data
public class DoctorDTO {
    private Long id;
    private String name;
    private String specialization;
    private String phone;
    private String email;
}
