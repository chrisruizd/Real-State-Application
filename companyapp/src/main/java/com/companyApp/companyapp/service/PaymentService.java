package com.companyApp.companyapp.service;

import com.companyApp.companyapp.dto.PaymentResponse;
import com.companyApp.companyapp.model.Payment;
import com.companyApp.companyapp.model.Tenant;

import java.util.List;

public interface PaymentService {
    Payment createInitialPayment(Tenant tenant);
    List<PaymentResponse> getPaymentsByTenantId(Long tenantId);
    List<PaymentResponse> getAllPayments();
    PaymentResponse markAsPaid(Long paymentId);
    PaymentResponse updatePaymentBalance(Long paymentId, Double newBalance);

}
