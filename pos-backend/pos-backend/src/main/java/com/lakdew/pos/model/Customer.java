package com.lakdew.pos.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

/**
 * Entity representing regular mechanics and store-credit customers at Lakdew Motors.
 * Tracks customer profile information and their dynamic outstanding debt balances.
 * (Peiris K.J.I.S. - IT25104044).
 */
@Entity
@Table(name = "customer")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "phone", length = 15)
    private String phone;

    /** Running total of unpaid store credit owed by the customer */
    @Column(name = "outstanding_balance", precision = 10, scale = 2)
    private BigDecimal outstandingBalance;

    /** Lifecycle callback to initialize outstanding balance to zero if null before insert */
    @PrePersist
    protected void onCreate() {
        if (outstandingBalance == null) {
            outstandingBalance = BigDecimal.ZERO;
        }
    }

    public Customer() {}

    // --- Standard Getters and Setters ---

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public BigDecimal getOutstandingBalance() { return outstandingBalance; }
    public void setOutstandingBalance(BigDecimal outstandingBalance) { this.outstandingBalance = outstandingBalance; }
}