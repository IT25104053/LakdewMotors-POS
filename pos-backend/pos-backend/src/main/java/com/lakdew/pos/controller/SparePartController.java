package com.lakdew.pos.controller;

import com.lakdew.pos.model.SparePart;
import com.lakdew.pos.repository.SparePartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/parts")
@CrossOrigin(origins = "*")
public class SparePartController {

    @Autowired
    private SparePartRepository sparePartRepository;

    @GetMapping
    public List<SparePart> getAllParts() {
        return sparePartRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createPart(@RequestBody SparePart sparePart) {
        if (sparePart.getPartId() == null || sparePart.getPartId().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("SKU / Part ID is required.");
        }
        if (sparePartRepository.existsById(sparePart.getPartId())) {
            return ResponseEntity.badRequest().body("SKU / Part ID already exists.");
        }
        // Auto-generate system barcode for hardware scanning[cite: 12, 15]
        if (sparePart.getBarcode() == null || sparePart.getBarcode().trim().isEmpty()) {
            String generatedBarcode = "LM-BAR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            sparePart.setBarcode(generatedBarcode);
        }
        SparePart savedPart = sparePartRepository.save(sparePart);
        return ResponseEntity.ok(savedPart);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SparePart> updatePart(@PathVariable String id, @RequestBody SparePart partDetails) {
        return sparePartRepository.findById(id)
                .map(part -> {
                    part.setPartName(partDetails.getPartName());
                    part.setBrand(partDetails.getBrand());
                    part.setUnitPrice(partDetails.getUnitPrice());
                    part.setStockQuantity(partDetails.getStockQuantity());
                    if (partDetails.getBarcode() != null) {
                        part.setBarcode(partDetails.getBarcode());
                    }
                    if (partDetails.getCategory() != null) {
                        part.setCategory(partDetails.getCategory());
                    }
                    SparePart updatedPart = sparePartRepository.save(part);
                    return ResponseEntity.ok(updatedPart);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePart(@PathVariable String id) {
        sparePartRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}