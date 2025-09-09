package com.companyApp.companyapp.model;


import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "tenants")
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Link to product (property)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private BigDecimal rent;
    private BigDecimal deposit;

    private LocalDate startDate;
    private LocalDate endDate;

    private boolean electricityFee;
    private boolean waterFee;

    private Integer numberTenants;

    // constructors
    public Tenant() {}

    public Tenant(User user, Product product, BigDecimal rent, BigDecimal deposit, LocalDate startDate,
                  LocalDate endDate, boolean electricityFee, boolean waterFee, Integer numberTenants) {
        this.user = user;
        this.product = product;
        this.rent = rent;
        this.deposit = deposit;
        this.startDate = startDate;
        this.endDate = endDate;
        this.electricityFee = electricityFee;
        this.waterFee = waterFee;
        this.numberTenants = numberTenants;
    }

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public BigDecimal getRent() { return rent; }
    public void setRent(BigDecimal rent) { this.rent = rent; }

    public BigDecimal getDeposit() { return deposit; }
    public void setDeposit(BigDecimal deposit) { this.deposit = deposit; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public boolean isElectricityFee() { return electricityFee; }
    public void setElectricityFee(boolean electricityFee) { this.electricityFee = electricityFee; }

    public boolean isWaterFee() { return waterFee; }
    public void setWaterFee(boolean waterFee) { this.waterFee = waterFee; }

    public Integer getNumberTenants() { return numberTenants; }
    public void setNumberTenants(Integer numberTenants) { this.numberTenants = numberTenants; }
}

