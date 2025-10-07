package com.companyApp.companyapp.dto;


import java.math.BigDecimal;
import java.time.LocalDate;

public class PaymentResponse {
    private Long id;
    private Long tenantId;
    private BigDecimal balance;
    private Boolean paid;
    private LocalDate paymentDate;
    private LocalDate dueDate;

    //public PaymentResponse() {}

    public PaymentResponse(Long id, Long tenantId, BigDecimal balance, Boolean paid, LocalDate paymentDate, LocalDate dueDate) {
        this.id = id;
        this.tenantId = tenantId;
        this.balance = balance;
        this.paid = paid;
        this.paymentDate = paymentDate;
        this.dueDate = dueDate;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getTenantId() { return tenantId; }
    public void setTenantId(Long tenantId) { this.tenantId = tenantId; }
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

