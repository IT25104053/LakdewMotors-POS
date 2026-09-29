package com.lakdewmotors.pos.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "purchase_order")
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long po_id;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @Column(columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime order_date;

    private LocalDateTime expected_delivery;

    @Column(length = 20, columnDefinition = "VARCHAR(20) DEFAULT 'PENDING'")
    private String status;

    // Getters and Setters
    public Long getPo_id() { return po_id; }
    public void setPo_id(Long po_id) { this.po_id = po_id; }

    public Supplier getSupplier() { return supplier; }
    public void setSupplier(Supplier supplier) { this.supplier = supplier; }

    public LocalDateTime getOrder_date() { return order_date; }
    public void setOrder_date(LocalDateTime order_date) { this.order_date = order_date; }

    public LocalDateTime getExpected_delivery() { return expected_delivery; }
    public void setExpected_delivery(LocalDateTime expected_delivery) { this.expected_delivery = expected_delivery; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}