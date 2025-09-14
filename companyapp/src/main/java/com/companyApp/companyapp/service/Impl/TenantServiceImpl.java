package com.companyApp.companyapp.service.Impl;


import com.companyApp.companyapp.dao.ProductDao;
import com.companyApp.companyapp.dao.TenantDao;
import com.companyApp.companyapp.dao.UserDao;
import com.companyApp.companyapp.dto.TenantRequest;
import com.companyApp.companyapp.dto.TenantResponse;
import com.companyApp.companyapp.exceptions.ResourceNotFoundException;
import com.companyApp.companyapp.model.Product;
import com.companyApp.companyapp.model.Tenant;
import com.companyApp.companyapp.model.User;
import com.companyApp.companyapp.service.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TenantServiceImpl implements TenantService {

    @Autowired
    private TenantDao tenantRepository;

    @Autowired
    private UserDao userRepository;

    @Autowired
    private ProductDao productRepository;

    public TenantResponse assignTenant(Long userId, TenantRequest request) {
        request.setUserId(userId); // ensure userId from path is bound
        return createTenant(request); // reuse your existing logic
    }


    @Override
    @Transactional
    public TenantResponse createTenant(TenantRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Prevent double-tenant on same product for same user (optional additional checks)
        List<Tenant> existing = tenantRepository.findByUser(user);
        boolean alreadyRentedSameProperty = existing.stream()
                .anyMatch(t -> t.getProduct().getId() == product.getId());
        if (alreadyRentedSameProperty) {
            throw new IllegalStateException("This user already assigned as tenant for this property");
        }

        // create tenant
        Tenant tenant = new Tenant();
        tenant.setUser(user);
        tenant.setProduct(product);
        tenant.setRent(request.getRent());
        tenant.setDeposit(request.getDeposit());
        tenant.setStartDate(request.getStartDate());
        tenant.setEndDate(request.getEndDate());
        tenant.setElectricityFee(request.isElectricityFee());
        tenant.setWaterFee(request.isWaterFee());
        tenant.setNumberTenants(request.getNumberTenants());

        Tenant saved = tenantRepository.save(tenant);

        // update user role => TENANT
        user.setRole(com.companyApp.companyapp.model.Role.TENANT);
        userRepository.save(user);

        // mark product unavailable if desired
        product.setProductAvailable(false);
        productRepository.save(product);

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TenantResponse> getAllTenants() {
        return tenantRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TenantResponse> getTenantsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return tenantRepository.findByUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TenantResponse getTenantById(Long id) {
        Tenant t = tenantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found"));
        return mapToResponse(t);
    }

    @Transactional
    public TenantResponse updateTenant(Long tenantId, TenantRequest request) {
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found"));

        // update only the editable fields
        tenant.setRent(request.getRent());
        tenant.setDeposit(request.getDeposit());
        tenant.setStartDate(request.getStartDate());
        tenant.setEndDate(request.getEndDate());
        tenant.setElectricityFee(request.isElectricityFee());
        tenant.setWaterFee(request.isWaterFee());
        tenant.setNumberTenants(request.getNumberTenants());

        Tenant saved = tenantRepository.save(tenant);
        return mapToResponse(saved);
    }


    private TenantResponse mapToResponse(Tenant t) {
        return new TenantResponse(
                t.getId(),
                t.getUser().getId(),
                t.getUser().getFullName(),
                (long) t.getProduct().getId(),
                t.getProduct().getAddress(),
                t.getRent(),
                t.getDeposit(),
                t.getStartDate(),
                t.getEndDate(),
                t.isElectricityFee(),
                t.isWaterFee(),
                t.getNumberTenants()
        );
    }
}

