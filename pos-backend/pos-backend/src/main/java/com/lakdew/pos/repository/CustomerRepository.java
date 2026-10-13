package com.lakdew.pos.repository;

import com.lakdew.pos.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA Repository for managing Customer (mechanic/credit account) persistence.
 * Inherits standard CRUD and pagination operations from JpaRepository.
 * (Peiris K.J.I.S. - IT25104044).
 */
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    // Inherits standard CRUD operations; custom queries can be added here as needed.
}