package com.lakdew.pos.repository;

import com.lakdew.pos.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA Repository for managing SystemUser / User authentication data access.
 * Handles database lookups for secure login and role-based access control (RBAC).
 * (Peiris K.J.I.S. - IT25104044).
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds a system user record by their unique login username.
     * Used primarily by the authentication controller during login validation.
     *
     * @param username The login username string
     * @return The User entity if found, null otherwise
     */
    User findByUsername(String username);
}