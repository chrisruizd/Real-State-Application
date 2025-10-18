package com.companyApp.companyapp.controller;

import com.companyApp.companyapp.dto.MaintenanceRequestDTO;
import com.companyApp.companyapp.service.MaintenanceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MaintenanceRequestController {

    @Autowired
    private MaintenanceRequestService maintenanceService;

    @PostMapping("/create")
    public ResponseEntity<MaintenanceRequestDTO> createRequest(
            @RequestParam Long tenantId,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile image
    ) throws IOException {
        return ResponseEntity.ok(maintenanceService.createRequest(tenantId, description, image));
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<MaintenanceRequestDTO>> getByTenant(@PathVariable Long tenantId) {
        return ResponseEntity.ok(maintenanceService.getRequestsByTenant(tenantId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<MaintenanceRequestDTO>> getAll() {
        return ResponseEntity.ok(maintenanceService.getAllRequests());
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam boolean status) {
        try {
            maintenanceService.updateStatus(id, status);
            return ResponseEntity.ok("Status updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

