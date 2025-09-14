package com.companyApp.companyapp.dao;


import com.companyApp.companyapp.model.Tenant;
import com.companyApp.companyapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TenantDao extends JpaRepository<Tenant, Long> {
    List<Tenant> findByUser(User user);
    List<Tenant> findByProductId(Long productId);
}

