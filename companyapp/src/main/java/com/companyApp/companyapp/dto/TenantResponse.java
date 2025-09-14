package com.companyApp.companyapp.dto;


import java.math.BigDecimal;
import java.time.LocalDate;

public class TenantResponse {
    private Long id;
    private Long userId;
    private String userFullName;
    private Long productId;
    private String productAddress;
    private BigDecimal rent;
    private BigDecimal deposit;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean electricityFee;
    private boolean waterFee;
    private Integer numberTenants;

    public TenantResponse() {}

    public TenantResponse(Long id, Long userId, String userFullName, Long productId, String productAddress,
                          BigDecimal rent, BigDecimal deposit, LocalDate startDate, LocalDate endDate,
                          boolean electricityFee, boolean waterFee, Integer numberTenants) {
        this.id = id;
        this.userId = userId;
        this.userFullName = userFullName;
        this.productId = productId;
        this.productAddress = productAddress;
        this.rent = rent;
        this.deposit = deposit;
        this.startDate = startDate;
        this.endDate = endDate;
        this.electricityFee = electricityFee;
        this.waterFee = waterFee;
        this.numberTenants = numberTenants;
    }

    // getters / setters (omitted for brevity in this listing)
    // generate all getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserFullName() { return userFullName; }
    public void setUserFullName(String userFullName) { this.userFullName = userFullName; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getProductAddress() { return productAddress; }
    public void setProductAddress(String productAddress) { this.productAddress = productAddress; }
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
