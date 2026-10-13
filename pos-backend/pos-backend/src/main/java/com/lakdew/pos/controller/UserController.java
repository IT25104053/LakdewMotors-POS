package com.lakdew.pos.controller;

import com.lakdew.pos.model.User;
import com.lakdew.pos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller handling system authentication, operator login, role-based access control (RBAC),
 * and admin user account management at Lakdew Motors.
 * (Peiris K.J.I.S. - IT25104044).
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    /**
     * Retrieves all registered system operator accounts for display in the admin management panel.
     *
     * @return List of all User accounts
     */
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Authenticates system operators attempting to log into the POS terminal.
     *
     * @param loginUser User payload containing username and password
     * @return ResponseEntity with the authenticated User entity or 401 Unauthorized error
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {
        User user = userRepository.findByUsername(loginUser.getUsername());
        if (user != null && user.getPassword().equals(loginUser.getPassword())) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    /**
     * Registers a new system operator account (e.g., Cashier) with default role assignment.
     *
     * @param newUser User entity payload containing username, password, and optional role
     * @return ResponseEntity with the saved User entity or 400 Bad Request if username exists
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User newUser) {
        if (userRepository.findByUsername(newUser.getUsername()) != null) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        // Assign default CASHIER role if none is provided
        if (newUser.getRole() == null || newUser.getRole().isEmpty()) {
            newUser.setRole("CASHIER");
        } else {
            newUser.setRole(newUser.getRole().toUpperCase());
        }

        User savedUser = userRepository.save(newUser);
        return ResponseEntity.ok(savedUser);
    }

    /**
     * Permanently deletes a system operator account by ID.
     *
     * @param id The ID of the user account to delete
     * @return Empty ResponseEntity upon successful deletion
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}