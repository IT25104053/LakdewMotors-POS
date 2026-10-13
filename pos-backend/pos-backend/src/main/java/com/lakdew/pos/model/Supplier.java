package com.lakdew.pos.model;

import jakarta.persistence.*;

@Entity
@Table(name = "supplier")
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "supplier_id")
    private Long supplierId;

    @Column(name = "company_name", nullable = false, length = 100)
    private String companyName;

    @Column(name = "contact_number", length = 15)
    private String contactNumber;

    @Column(name = "address", length = 255)
    private String address;

    public Supplier() {}

    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    // Aliases for seamless frontend compatibility
    public String getName() { return companyName; }
    public void setName(String name) { this.companyName = name; }
    public String getPhone() { return contactNumber; }
    public void setPhone(String phone) { this.contactNumber = phone; }
}