package com.lakdewmotors.pos.controller;

import com.lakdewmotors.pos.model.Product;
import com.lakdewmotors.pos.model.Sale;
import com.lakdewmotors.pos.model.SaleItem;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {
    @PostMapping
    @Transactional
    public ResponseEntity<?> checkout(@RequestBody Map<String, Object> payload) {
        try {
            String cashier = (String) payload.get("cashier");
            String paymentType = (String) payload.get("payment");
            
            // Handle number types properly
            Double discount = Double.valueOf(payload.get("discount").toString());
            Double tax = Double.valueOf(payload.get("tax").toString());
            Double total = Double.valueOf(payload.get("total").toString());
            
            List<Map<String, Object>> items = (List<Map<String, Object>>) payload.get("items");

            String invoiceId = "INV-" + LocalDateTime.now().getYear() + "-" + (1000 + new Random().nextInt(9000));

            Sale sale = new Sale();
            sale.setInvoiceId(invoiceId);
            sale.setSaleDate(LocalDateTime.now());
            sale.setCashier(cashier);
            sale.setPaymentType(paymentType);
            sale.setDiscount(discount);
            sale.setTax(tax);
            sale.setTotal(total);

            for (Map<String, Object> itemMap : items) {
                String sku = (String) itemMap.get("sku");
                Integer qty = (Integer) itemMap.get("qty");

                if (product.getStock() < qty) {
                    throw new RuntimeException("Insufficient stock for " + product.getName());
                }
                product.setStock(product.getStock() - qty);

                // Create SaleItem
                SaleItem saleItem = new SaleItem();
                saleItem.setSku(sku);
                saleItem.setName(product.getName());
                saleItem.setQuantity(qty);
                saleItem.setPrice(product.getPrice());
                saleItem.setSale(sale);
                sale.getItems().add(saleItem);
            }

            saleRepository.save(sale);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("invoice", invoiceId);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
