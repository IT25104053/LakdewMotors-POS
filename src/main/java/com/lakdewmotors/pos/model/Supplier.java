package com.lakdewmotors.pos.model;

import jakarta.persistence.*;

@Entity
@Table(name = "supplier")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long supplier_id;

    @Column(nullable = false, length = 100)
    private String company_name;

    @Column(length = 15)
    private String contact_number;

    @Column(length = 255)
    private String address;

    // Getters and Setters
    public Long getSupplier_id() { return supplier_id; }
    public void setSupplier_id(Long supplier_id) { this.supplier_id = supplier_id; }

    public String getCompany_name() { return company_name; }
    public void setCompany_name(String company_name) { this.company_name = company_name; }

    public String getContact_number() { return contact_number; }
    public void setContact_number(String contact_number) { this.contact_number = contact_number; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}