package com.lakdew.pos.model;

import jakarta.persistence.*;

/**
 * Entity representing system operators (Admins and Cashiers) for application access control and RBAC.
 * Maps directly to the 'user' table in the relational database.
 * (Peiris K.J.I.S. - IT25104044).
 */
@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    /** System permission role assigned to the user (e.g., ADMIN, CASHIER) */
    @Column(name = "role", nullable = false)
    private String role;

    public User() {}

    // --- Standard Getters and Setters ---

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}