package com.lakdew.pos.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity representing the Credit Ledger module for Lakdew Motors.
 * Tracks all credit transactions, accumulating debt from unpaid orders
 * and recording customer cash repayments over time.
 * (Peiris K.J.I.S. - IT25104044).
 */
@Entity
@Table(name = "credit_ledger")
public class CreditLedger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ledger_id")
    private Long ledgerId;

    /** Many-to-One relationship linking this ledger entry to a registered customer/mechanic */
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    /** Foreign key reference to the sales order associated with the credit debt */
    @Column(name = "order_id")
    private Long orderId;

    /** Timestamp recording when the credit or repayment transaction occurred */
    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate = LocalDateTime.now();

    /** Amount of new debt added in this transaction instance */
    @Column(name = "amount_added", precision = 10, scale = 2)
    private BigDecimal amountAdded = BigDecimal.ZERO;

    /** Amount of cash repaid by the customer in this transaction instance */
    @Column(name = "amount_paid", precision = 10, scale = 2)
    private BigDecimal amountPaid = BigDecimal.ZERO;

    // --- Standard Getters and Setters ---

    public Long getLedgerId() { return ledgerId; }
    public void setLedgerId(Long ledgerId) { this.ledgerId = ledgerId; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public LocalDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }

    public BigDecimal getAmountAdded() { return amountAdded; }
    public void setAmountAdded(BigDecimal amountAdded) { this.amountAdded = amountAdded; }

    public BigDecimal getAmountPaid() { return amountPaid; }
    public void setAmountPaid(BigDecimal amountPaid) { this.amountPaid = amountPaid; }
}