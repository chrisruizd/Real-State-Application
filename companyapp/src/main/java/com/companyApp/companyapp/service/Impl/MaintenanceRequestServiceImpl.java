package com.companyApp.companyapp.service.Impl;

import com.companyApp.companyapp.dao.MaintenanceRequestDao;
import com.companyApp.companyapp.dao.TenantDao;
import com.companyApp.companyapp.dto.MaintenanceRequestDTO;
import com.companyApp.companyapp.model.MaintenanceRequest;
import com.companyApp.companyapp.model.Tenant;
import com.companyApp.companyapp.service.MaintenanceRequestService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MaintenanceRequestServiceImpl implements MaintenanceRequestService {

    @Autowired
    private MaintenanceRequestDao maintenanceRepo;

    @Autowired
    private TenantDao tenantRepo;

    private final String UPLOAD_DIR = "uploads/";

    @Override
    @Transactional
    public MaintenanceRequestDTO createRequest(Long tenantId, String description, MultipartFile image) throws IOException {
        Tenant tenant = tenantRepo.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        MaintenanceRequest request = new MaintenanceRequest();
        request.setTenant(tenant);
        request.setDescription(description);
        request.setStatus(true);

        if (image != null && !image.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            Files.createDirectories(filePath.getParent());
            Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            request.setImageUrl("/" + UPLOAD_DIR + fileName);
        }

        MaintenanceRequest saved = maintenanceRepo.save(request);
        return toDTO(saved);
    }

    @Override
    @Transactional
    public List<MaintenanceRequestDTO> getRequestsByTenant(Long tenantId) {
        return maintenanceRepo.findByTenantId(tenantId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<MaintenanceRequestDTO> getAllRequests() {
        return maintenanceRepo.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void updateStatus(Long id, boolean status) {
        MaintenanceRequest req = maintenanceRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        req.setStatus(status);
        maintenanceRepo.save(req);
    }

    private MaintenanceRequestDTO toDTO(MaintenanceRequest req) {
        String address = req.getTenant().getProduct() != null ? req.getTenant().getProduct().getAddress() : "N/A";

        return new MaintenanceRequestDTO(
                req.getId(),
                req.getDescription(),
                req.isStatus(),
                req.getDateCreated(),
                req.getImageUrl(),
                req.getTenant().getId(),
                req.getTenant().getUser() != null ? req.getTenant().getUser().getFullName() : "Unknown",
                address
        );
    }
}



