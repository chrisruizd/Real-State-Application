package com.companyApp.companyapp.dto;


import java.math.BigDecimal;
import java.time.LocalDate;

public class TenantRequest {
    private Long userId;
    private Long productId;
    private BigDecimal rent;
    private BigDecimal deposit;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean electricityFee;
    private boolean waterFee;
    private Integer numberTenants;

    // getters / setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

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
