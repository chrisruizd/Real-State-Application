package com.companyApp.companyapp.controller;


import com.companyApp.companyapp.dto.TenantRequest;
import com.companyApp.companyapp.dto.TenantResponse;
import com.companyApp.companyapp.service.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/tenants")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TenantController {

    @Autowired
    private TenantService tenantService;

    // Create tenant (ADMIN only)
    @PostMapping("/assign/{userId}")
    public ResponseEntity<?> createTenant(@PathVariable Long userId, @RequestBody TenantRequest request) {
        try {
            TenantResponse resp = tenantService.assignTenant(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(resp);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // only admins can update
    public ResponseEntity<TenantResponse> updateTenant(
            @PathVariable Long id,
            @RequestBody TenantRequest request) {
        return ResponseEntity.ok(tenantService.updateTenant(id, request));
    }

    // Admin list all tenants
    @GetMapping
    public ResponseEntity<List<TenantResponse>> getAllTenants() {
        List<TenantResponse> list = tenantService.getAllTenants();
        return ResponseEntity.ok(list);
    }

    // Tenants by user id
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TenantResponse>> getTenantsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(tenantService.getTenantsByUserId(userId));
    }

    // Single tenant
    @GetMapping("/{id}")
    public ResponseEntity<TenantResponse> getTenant(@PathVariable Long id) {
        return ResponseEntity.ok(tenantService.getTenantById(id));
    }
}

