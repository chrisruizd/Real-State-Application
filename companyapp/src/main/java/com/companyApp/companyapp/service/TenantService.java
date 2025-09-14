package com.companyApp.companyapp.service;


import com.companyApp.companyapp.dto.TenantRequest;
import com.companyApp.companyapp.dto.TenantResponse;

import java.util.List;

public interface TenantService {
    TenantResponse assignTenant(Long userId, TenantRequest request);
    TenantResponse createTenant(TenantRequest request);
    List<TenantResponse> getAllTenants();
    List<TenantResponse> getTenantsByUserId(Long userId);
    TenantResponse getTenantById(Long id);
}

