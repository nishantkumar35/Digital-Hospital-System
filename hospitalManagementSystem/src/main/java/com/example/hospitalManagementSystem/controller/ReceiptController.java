package com.example.hospitalManagementSystem.controller;

import com.example.hospitalManagementSystem.dto.CreateReceiptDTO;
import com.example.hospitalManagementSystem.dto.ReceiptDTO;
import com.example.hospitalManagementSystem.service.ReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/receipts")
public class ReceiptController {

    @Autowired
    private ReceiptService receiptService;

    @PostMapping
    public ResponseEntity<ReceiptDTO> createReceipt(@RequestBody CreateReceiptDTO createReceiptDTO) {
        return new ResponseEntity<>(receiptService.createReceipt(createReceiptDTO), HttpStatus.CREATED);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<ReceiptDTO>> getReceiptsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(receiptService.getReceiptsByPatientId(patientId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReceiptDTO> getReceiptById(@PathVariable Long id) {
        return ResponseEntity.ok(receiptService.getReceiptById(id));
    }
}
