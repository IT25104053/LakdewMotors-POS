package com.lakdewmotors.pos.model;

import jakarta.persistence.*;

@Entity
@Table(name = "spare_part")
public class SparePart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long part_id;

    @Column(nullable = false, length = 100)
    private String part_name;

    @Column(length = 50)
    private String brand;

    @Column(nullable = false, columnDefinition = "DECIMAL(10,2)")
    private Double unit_price;

    @Column(nullable = false)
    private Integer stock_quantity;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    // Getters and Setters
    public Long getPart_id() { return part_id; }
    public void setPart_id(Long part_id) { this.part_id = part_id; }

    public String getPart_name() { return part_name; }
    public void setPart_name(String part_name) { this.part_name = part_name; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public Double getUnit_price() { return unit_price; }
    public void setUnit_price(Double unit_price) { this.unit_price = unit_price; }

    public Integer getStock_quantity() { return stock_quantity; }
    public void setStock_quantity(Integer stock_quantity) { this.stock_quantity = stock_quantity; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
}
