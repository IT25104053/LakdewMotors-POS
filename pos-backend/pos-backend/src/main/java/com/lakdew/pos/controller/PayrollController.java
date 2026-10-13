package com.lakdew.pos.controller;

import com.lakdew.pos.model.Employee;
import com.lakdew.pos.model.Payroll;
import com.lakdew.pos.repository.EmployeeRepository;
import com.lakdew.pos.repository.PayrollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@CrossOrigin(origins = "*")
public class PayrollController {
    @Autowired
    private PayrollRepository payrollRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping
    public List<Payroll> getAllPayrolls() { return payrollRepository.findAll(); }

    @PostMapping
    public ResponseEntity<?> createPayroll(@RequestBody PayrollRequest req) {
        Employee emp = employeeRepository.findById(req.getEmpId()).orElse(null);
        if (emp == null) return ResponseEntity.badRequest().body("Employee not found");

        BigDecimal finalSalary = emp.getHourlyRate().multiply(req.getTotalHours());

        Payroll payroll = new Payroll();
        payroll.setEmployee(emp);
        payroll.setMonth(req.getMonth());
        payroll.setTotalHours(req.getTotalHours());
        payroll.setFinalSalary(finalSalary);

        Payroll saved = payrollRepository.save(payroll);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePayroll(@PathVariable Long id) {
        payrollRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    public static class PayrollRequest {
        private Long empId;
        private String month;
        private BigDecimal totalHours;

        public Long getEmpId() { return empId; }
        public void setEmpId(Long empId) { this.empId = empId; }
        public String getMonth() { return month; }
        public void setMonth(String month) { this.month = month; }
        public BigDecimal getTotalHours() { return totalHours; }
        public void setTotalHours(BigDecimal totalHours) { this.totalHours = totalHours; }
    }
}