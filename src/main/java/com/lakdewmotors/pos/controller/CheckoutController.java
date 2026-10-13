package com.lakdew.pos.controller;

import com.lakdew.pos.model.*;
import com.lakdew.pos.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/checkout")
@CrossOrigin(origins = "*")
public class CheckoutController {

    @Autowired
    private SalesOrderRepository salesOrderRepository;

    @Autowired
    private OrderDetailsRepository orderDetailsRepository;

    @Autowired
    private SparePartRepository sparePartRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CreditLedgerRepository creditLedgerRepo;

    @Autowired
    private PaymentTransactionRepository paymentTransactionRepo;

    @PostMapping
    public ResponseEntity<?> processCheckout(@RequestBody CheckoutPayload payload) {
        SalesOrder order = new SalesOrder();
        order.setSubTotal(payload.getSubTotal());
        order.setDiscountAmount(payload.getDiscountAmount());
        order.setFinalTotal(payload.getFinalTotal());
        order.setOrderDate(LocalDateTime.now());

        SalesOrder savedOrder = salesOrderRepository.save(order);
        PaymentTransaction payment = new PaymentTransaction();
        payment.setOrderId(savedOrder.getOrderId());
        payment.setPaymentMethod(payload.getPaymentMethod());
        payment.setGatewayRef("GW-REF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setStatus("SUCCESS");
        paymentTransactionRepo.save(payment);

        if (payload.getItems() != null) {
            for (CheckoutItem itemDto : payload.getItems()) {
                SparePart part = sparePartRepository.findById(itemDto.getPartId()).orElse(null);
                if (part != null) {
                    if (part.getStockQuantity() < itemDto.getQuantity()) {
                        return ResponseEntity.badRequest().body("Insufficient stock for part: " + part.getPartName());
                    }
                    part.setStockQuantity(part.getStockQuantity() - itemDto.getQuantity());
                    sparePartRepository.save(part);

                    OrderDetails details = new OrderDetails();
                    details.setSalesOrder(savedOrder);
                    details.setSparePart(part);
                    details.setQuantity(itemDto.getQuantity());
                    details.setSubTotal(itemDto.getSubTotal());
                    orderDetailsRepository.save(details);
                }
            }
        }

        if ("CREDIT".equalsIgnoreCase(payload.getPaymentMethod()) && payload.getCustomerId() != null) {
            Customer customer = customerRepository.findById(payload.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            customer.setOutstandingBalance(customer.getOutstandingBalance().add(payload.getFinalTotal()));
            customerRepository.save(customer);

            CreditLedger ledger = new CreditLedger();
            ledger.setCustomer(customer);
            ledger.setOrderId(savedOrder.getOrderId());
            ledger.setAmountAdded(payload.getFinalTotal());
            creditLedgerRepo.save(ledger);
        }

        return ResponseEntity.ok("Checkout Completed Successfully");
    }

    public static class CheckoutPayload {
        private BigDecimal subTotal;
        private BigDecimal discountAmount;
        private BigDecimal finalTotal;
        private String paymentMethod;
        private Long customerId;
        private List<CheckoutItem> items;

        public BigDecimal getSubTotal() { return subTotal; }
        public void setSubTotal(BigDecimal subTotal) { this.subTotal = subTotal; }
        public BigDecimal getDiscountAmount() { return discountAmount; }
        public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }
        public BigDecimal getFinalTotal() { return finalTotal; }
        public void setFinalTotal(BigDecimal finalTotal) { this.finalTotal = finalTotal; }
        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
        public Long getCustomerId() { return customerId; }
        public void setCustomerId(Long customerId) { this.customerId = customerId; }
        public List<CheckoutItem> getItems() { return items; }
        public void setItems(List<CheckoutItem> items) { this.items = items; }
    }

    public static class CheckoutItem {
        private String partId;
        private int quantity;
        private BigDecimal subTotal;

        public String getPartId() { return partId; }
        public void setPartId(String partId) { this.partId = partId; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
        public BigDecimal getSubTotal() { return subTotal; }
        public void setSubTotal(BigDecimal subTotal) { this.subTotal = subTotal; }
    }
}
