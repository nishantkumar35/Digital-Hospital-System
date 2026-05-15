package com.example.hospitalManagementSystem.repository;

import com.example.hospitalManagementSystem.entity.ReceiptMedicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReceiptMedicineRepository extends JpaRepository<ReceiptMedicine, Long> {
    List<ReceiptMedicine> findByReceiptId(Long receiptId);
}
