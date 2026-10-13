package com.lakdew.pos.controller;

import com.lakdew.pos.model.CreditLedger;
import com.lakdew.pos.model.Customer;
import com.lakdew.pos.repository.CreditLedgerRepository;
import com.lakdew.pos.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * REST Controller managing customer credit tracking, historical ledger logs, and debt repayments at Lakdew Motors.
 * Exposes API endpoints for retrieving credit history and processing customer cash repayments.
 * (Peiris K.J.I.S. - IT25104044).
 */
@RestController
@RequestMapping("/api/credit-ledger")
@CrossOrigin(origins = "*")
public class CreditLedgerController {

    @Autowired
    private CreditLedgerRepository creditLedgerRepository;

    @Autowired
    private CustomerRepository customerRepository;

    /**
     * Retrieves all chronological credit ledger entries across all customers.
     *
     * @return List of all CreditLedger records
     */
    @GetMapping
    public List<CreditLedger> getAllLedgerEntries() {
        return creditLedgerRepository.findAll();
    }

    /**
     * Retrieves the chronological credit ledger history for a specific customer.
     *
     * @param customerId The ID of the customer
     * @return List of CreditLedger records belonging to the specified customer
     */
    @GetMapping("/customer/{customerId}")
    public List<CreditLedger> getLedgerByCustomer(@PathVariable Long customerId) {
        return creditLedgerRepository.findByCustomerCustomerId(customerId);
    }

    /**
     * Processes a customer credit repayment, updating their outstanding balance
     * and recording the transaction in the chronological credit ledger.
     *
     * @param req RepaymentRequest payload containing customer ID and repayment amount
     * @return ResponseEntity containing the updated Customer entity or a bad request error
     */
    @PostMapping("/repay")
    public ResponseEntity<?> recordRepayment(@RequestBody RepaymentRequest req) {
        Customer customer = customerRepository.findById(req.getCustomerId()).orElse(null);
        if (customer == null) return ResponseEntity.badRequest().body("Customer not found");

        BigDecimal paid = req.getAmountPaid();
        if (paid == null || paid.compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body("Invalid repayment amount");
        }

        // Deduct repayment from customer's running outstanding balance
        customer.setOutstandingBalance(customer.getOutstandingBalance().subtract(paid));
        customerRepository.save(customer);

        // Log repayment entry in the credit ledger
        CreditLedger ledger = new CreditLedger();
        ledger.setCustomer(customer);
        ledger.setAmountPaid(paid);
        ledger.setAmountAdded(BigDecimal.ZERO);
        creditLedgerRepository.save(ledger);

        return ResponseEntity.ok(customer);
    }

    /**
     * Data Transfer Object (DTO) for capturing credit addition requests.
     */
    public static class CreditLedgerRequest {
        private Long customerId;
        private Long orderId;
        private BigDecimal amountAdded;

        public Long getCustomerId() { return customerId; }
        public void setCustomerId(Long customerId) { this.customerId = customerId; }
        public Long getOrderId() { return orderId; }
        public void setOrderId(Long orderId) { this.orderId = orderId; }
        public BigDecimal getAmountAdded() { return amountAdded; }
        public void setAmountAdded(BigDecimal amountAdded) { this.amountAdded = amountAdded; }
    }

    /**
     * Data Transfer Object (DTO) for capturing customer debt repayment payloads.
     */
    public static class RepaymentRequest {
        private Long customerId;
        private BigDecimal amountPaid;

        public Long getCustomerId() { return customerId; }
        public void setCustomerId(Long customerId) { this.customerId = customerId; }
        public BigDecimal getAmountPaid() { return amountPaid; }
        public void setAmountPaid(BigDecimal amountPaid) { this.amountPaid = amountPaid; }
    }
}