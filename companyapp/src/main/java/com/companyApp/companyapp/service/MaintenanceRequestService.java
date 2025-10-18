package com.companyApp.companyapp.service;

import com.companyApp.companyapp.dto.MaintenanceRequestDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface MaintenanceRequestService {
    MaintenanceRequestDTO createRequest(Long tenantId, String description, MultipartFile image) throws IOException;
    List<MaintenanceRequestDTO> getRequestsByTenant(Long tenantId);
    List<MaintenanceRequestDTO> getAllRequests();
    void updateStatus(Long id, boolean status);
}
