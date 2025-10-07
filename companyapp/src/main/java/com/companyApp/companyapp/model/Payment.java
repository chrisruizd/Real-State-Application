package com.companyApp.companyapp.model;


import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to tenant
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    private BigDecimal balance;

    private Boolean paid;

    private LocalDate paymentDate;

    private LocalDate dueDate;

    // Constructors
    public Payment() {}

    public Payment(Tenant tenant, BigDecimal balance, Boolean paid, LocalDate paymentDate, LocalDate dueDate) {
        this.tenant = tenant;
        this.balance = balance;
        this.paid = paid;
        this.paymentDate = paymentDate;
        this.dueDate = dueDate;
    }

    // Getters & setters
    public Long getId() { return id; }
    public Tenant getTenant() { return tenant; }
    public void setTenant(Tenant tenant) { this.tenant = tenant; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }

    public Boolean getPaid() { return paid; }
    public void setPaid(Boolean paid) { this.paid = paid; }

    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
}

