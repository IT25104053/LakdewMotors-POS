package com.lakdew.pos.controller;

import com.lakdew.pos.model.PurchaseOrder;
import com.lakdew.pos.model.Supplier;
import com.lakdew.pos.repository.PurchaseOrderRepository;
import com.lakdew.pos.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchase-orders")
@CrossOrigin(origins = "*")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderRepository poRepo;

    @Autowired
    private SupplierRepository supplierRepo;

    @GetMapping
    public List<PurchaseOrder> getAllPurchaseOrders() {
        return poRepo.findAll();
    }

    @PostMapping
    public PurchaseOrder createPurchaseOrder(@RequestBody PurchaseOrderDTO payload) {
        Supplier supplier = supplierRepo.findById(payload.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        PurchaseOrder po = new PurchaseOrder();
        po.setSupplier(supplier);
        po.setExpectedDelivery(payload.getExpectedDelivery());
        po.setStatus("PENDING");
        return poRepo.save(po);
    }

    @PutMapping("/{id}/receive")
    public PurchaseOrder markAsReceived(@PathVariable Long id) {
        PurchaseOrder po = poRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("PO not found"));
        po.setStatus("RECEIVED");
        return poRepo.save(po);
    }

    // DTO for mapping React data
    public static class PurchaseOrderDTO {
        private Long supplierId;
        private java.time.LocalDateTime expectedDelivery;

        public Long getSupplierId() { return supplierId; }
        public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }
        public java.time.LocalDateTime getExpectedDelivery() { return expectedDelivery; }
        public void setExpectedDelivery(java.time.LocalDateTime expectedDelivery) { this.expectedDelivery = expectedDelivery; }
    }
}