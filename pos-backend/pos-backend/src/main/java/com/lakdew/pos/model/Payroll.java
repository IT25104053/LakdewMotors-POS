package com.lakdew.pos.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "payroll")
public class Payroll {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payroll_id")
    private Long payrollId;

    @ManyToOne
    @JoinColumn(name = "emp_id", nullable = false)
    private Employee employee;

    @Column(nullable = false, length = 20)
    private String month;

    @Column(name = "total_hours", nullable = false, precision = 5, scale = 2)
    private BigDecimal totalHours;

    @Column(name = "final_salary", nullable = false, precision = 10, scale = 2)
    private BigDecimal finalSalary;

    public Long getPayrollId() { return payrollId; }
    public void setPayrollId(Long payrollId) { this.payrollId = payrollId; }
    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }
    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }
    public BigDecimal getTotalHours() { return totalHours; }
    public void setTotalHours(BigDecimal totalHours) { this.totalHours = totalHours; }
    public BigDecimal getFinalSalary() { return finalSalary; }
    public void setFinalSalary(BigDecimal finalSalary) { this.finalSalary = finalSalary; }
}