package com.companyApp.companyapp.dao;


import com.companyApp.companyapp.model.Payment;
import com.companyApp.companyapp.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentDao extends JpaRepository<Payment, Long> {
    List<Payment> findByTenant(Tenant tenant);
}