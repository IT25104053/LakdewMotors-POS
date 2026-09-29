package com.lakdewmotors.pos.controller;

import com.lakdewmotors.pos.model.SparePart;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class SparePartController {

    @Autowired
    private SparePartRepository sparePartRepository;

    @GetMapping
    public List<SparePart> getAllProducts() {
        return sparePartRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> saveProduct(@RequestBody SparePart sparePart) {
        SparePart savedSparePart = sparePartRepository.save(sparePart);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("product", savedSparePart);
        return ResponseEntity.ok(response);
    }
}
