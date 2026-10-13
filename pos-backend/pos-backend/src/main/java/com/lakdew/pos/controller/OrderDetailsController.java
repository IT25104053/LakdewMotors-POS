package com.lakdew.pos.controller;

import com.lakdew.pos.model.OrderDetails;
import com.lakdew.pos.repository.OrderDetailsRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-details")
@CrossOrigin
public class OrderDetailsController {

    private final OrderDetailsRepository repository;

    public OrderDetailsController(OrderDetailsRepository repository) {
        this.repository = repository;
    }

    // GET: Fetch all order details
    @GetMapping
    public List<OrderDetails> getAllOrderDetails() {
        return repository.findAll();
    }

    // POST: Create a new order detail row
    @PostMapping
    public OrderDetails addOrderDetail(@RequestBody OrderDetails orderDetails) {
        return repository.save(orderDetails);
    }

    // DELETE: Remove an order detail row by ID
    @DeleteMapping("/{id}")
    public void deleteOrderDetail(@PathVariable Long id) {
        repository.deleteById(id);
    }
}