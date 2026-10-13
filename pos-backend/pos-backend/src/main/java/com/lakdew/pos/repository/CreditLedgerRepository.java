package com.lakdew.pos.repository;

import com.lakdew.pos.model.CreditLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA Repository for managing CreditLedger entity persistence and database operations.
 * Provides custom query derivation for filtering credit history by specific customer IDs.
 * (Peiris K.J.I.S. - IT25104044).
 */
@Repository
public interface CreditLedgerRepository extends JpaRepository<CreditLedger, Long> {

    /**
     * Custom finder method to retrieve all chronological credit ledger entries for a given customer.
     *
     * @param customerId The unique identifier of the customer/mechanic
     * @return List of CreditLedger transactions associated with the customer
     */
    List<CreditLedger> findByCustomerCustomerId(Long customerId);
}