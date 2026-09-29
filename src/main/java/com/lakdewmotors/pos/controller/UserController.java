package com.lakdewmotors.pos.controller;

import com.lakdewmotors.pos.model.User;
import com.lakdewmotors.pos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // 1. Process standard POS logins (Plain text)
    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Optional<User> userOpt = userRepository.findByUsername(username);

        // Plain-text check against your manual SQL entries
        if (userOpt.isPresent() && password.equals(userOpt.get().getPassword())) {
            User user = userOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);

            Map<String, String> userData = new HashMap<>();
            userData.put("name", user.getName());
            userData.put("role", user.getRole());

            response.put("user", userData);
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid credentials"));
    }

    // 2. Verify admin credentials for sensitive changes (Plain text)
    @PostMapping("/api/admin-check")
    public ResponseEntity<?> adminCheck(@RequestBody Map<String, String> payload) {
        String pwd = payload.get("password");

        boolean isValid = userRepository.findAll().stream()
                .filter(u -> "admin".equals(u.getRole()))
                .anyMatch(u -> pwd.equals(u.getPassword()));

        if (isValid) {
            return ResponseEntity.ok(Map.of("success", true));
        }
        return ResponseEntity.badRequest().body(Map.of("success", false));
    }

    // 3. Fetch all cashiers
    @GetMapping("/api/users/cashiers")
    public List<User> getCashiers() {
        return userRepository.findAll().stream()
                .filter(u -> "cashier".equals(u.getRole()))
                .collect(Collectors.toList());
    }

    // 4. Add a new cashier via the Settings menu
    @PostMapping("/api/users/cashiers")
    public ResponseEntity<?> addCashier(@RequestBody User newUser) {
        if (userRepository.findByUsername(newUser.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Username already exists"));
        }

        newUser.setRole("cashier");
        userRepository.save(newUser);
        return ResponseEntity.ok(Map.of("success", true));
    }

    // 5. Delete a cashier
    @DeleteMapping("/api/users/cashiers/{id}")
    public ResponseEntity<?> deleteCashier(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}