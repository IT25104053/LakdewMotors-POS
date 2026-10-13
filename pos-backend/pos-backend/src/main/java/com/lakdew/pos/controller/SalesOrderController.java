package com.lakdew.pos.controller;

import com.lakdew.pos.model.SalesOrder;
import com.lakdew.pos.repository.SalesOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "*")
public class SalesOrderController {

    @Autowired
    private SalesOrderRepository salesOrderRepo;

    @GetMapping
    public List<SalesOrder> getAllSales() {
        return salesOrderRepo.findAll();
    }
}