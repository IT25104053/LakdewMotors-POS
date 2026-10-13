package com.lakdew.pos.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "purchase_order")
public class PurchaseOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "po_id")
    private Long poId;

    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @Column(name = "expected_delivery")
    private LocalDateTime expectedDelivery;

    @Column(name = "status", length = 20)
    private String status;

    @PrePersist
    protected void onCreate() {
        if (orderDate == null) { orderDate = LocalDateTime.now(); }
        if (status == null) { status = "PENDING"; }
    }

    public PurchaseOrder() {}

    public Long getPoId() { return poId; }
    public void setPoId(Long poId) { this.poId = poId; }
    public Supplier getSupplier() { return supplier; }
    public void setSupplier(Supplier supplier) { this.supplier = supplier; }
    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }
    public LocalDateTime getExpectedDelivery() { return expectedDelivery; }
    public void setExpectedDelivery(LocalDateTime expectedDelivery) { this.expectedDelivery = expectedDelivery; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}