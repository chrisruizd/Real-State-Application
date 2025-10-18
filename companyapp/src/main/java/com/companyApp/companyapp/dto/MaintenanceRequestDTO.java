package com.companyApp.companyapp.dto;


import java.time.LocalDateTime;

public class MaintenanceRequestDTO {
    private Long id;
    private String description;
    private boolean status;
    private LocalDateTime dateCreated;
    private String imageUrl;
    private Long tenantId;
    private String tenantName;
    private String address;

    public MaintenanceRequestDTO(Long id, String description, boolean status, LocalDateTime dateCreated, String imageUrl, Long tenantId, String tenantName, String address) {
        this.id = id;
        this.description = description;
        this.status = status;
        this.dateCreated = dateCreated;
        this.imageUrl = imageUrl;
        this.tenantId = tenantId;
        this.tenantName = tenantName;
        this.address = address;
    }

    public Long getId() { return id; }
    public String getDescription() { return description; }
    public boolean isStatus() { return status; }
    public LocalDateTime getDateCreated() { return dateCreated; }
    public String getImageUrl() { return imageUrl; }
    public Long getTenantId() { return tenantId; }
    public String getTenantName() { return tenantName; }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}

