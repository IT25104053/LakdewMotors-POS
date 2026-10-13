package com.lakdew.pos.controller;

import com.lakdew.pos.model.Customer;
import com.lakdew.pos.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller managing customer and mechanic accounts, registrations, and credit profiles at Lakdew Motors.
 * Exposes CRUD endpoints for customer directory management.
 * (Peiris K.J.I.S. - IT25104044).
 */
@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    /**
     * Retrieves the complete directory of registered customers/mechanics.
     *
     * @return List of all Customer entities
     */
    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    /**
     * Registers a new customer or mechanic in the system.
     *
     * @param customer The Customer entity payload
     * @return The saved Customer entity
     */
    @PostMapping
    public Customer createCustomer(@RequestBody Customer customer) {
        return customerRepository.save(customer);
    }

    /**
     * Updates existing customer profile details (Name, Phone).
     *
     * @param id The ID of the customer to update
     * @param customerDetails Updated customer attributes
     * @return ResponseEntity with the updated Customer or 404 Not Found if missing
     */
    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer customerDetails) {
        return customerRepository.findById(id)
                .map(customer -> {
                    customer.setName(customerDetails.getName());
                    customer.setPhone(customerDetails.getPhone());
                    Customer updatedCustomer = customerRepository.save(customer);
                    return ResponseEntity.ok(updatedCustomer);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Permanently deletes a customer record from the database.
     *
     * @param id The ID of the customer to delete
     * @return Empty ResponseEntity upon successful deletion
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id) {
        customerRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}