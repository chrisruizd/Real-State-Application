package com.companyApp.companyapp.service.Impl;

import com.companyApp.companyapp.dao.PaymentDao;
import com.companyApp.companyapp.dao.TenantDao;
import com.companyApp.companyapp.dto.PaymentResponse;
import com.companyApp.companyapp.exceptions.ResourceNotFoundException;
import com.companyApp.companyapp.model.Payment;
import com.companyApp.companyapp.model.Tenant;
import com.companyApp.companyapp.service.PaymentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImpl implements PaymentService {
    private final PaymentDao paymentRepository;
    private final TenantDao tenantRepository;


    public PaymentServiceImpl(PaymentDao paymentRepository, TenantDao tenantRepository) {
        this.paymentRepository = paymentRepository;
        this.tenantRepository = tenantRepository;
    }

    public Payment createInitialPayment(Tenant tenant) {
        LocalDate nextMonthFirstDay = LocalDate.now().plusMonths(1).withDayOfMonth(1);

        Payment payment = new Payment(
                tenant,
                tenant.getRent(),  // rent from tenant
                false,             // not paid yet
                null,               // no payment date yet
                nextMonthFirstDay
        );

        return paymentRepository.save(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByTenantId(Long tenantId) {
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found"));

        return paymentRepository.findByTenant(tenant).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ✅ Fetch all payments (admin use)
    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ✅ Mark payment as paid
    @Override
    @Transactional
    public PaymentResponse markAsPaid(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        payment.setPaid(true);
        payment.setPaymentDate(LocalDate.now()); //payment date
        Payment updated = paymentRepository.save(payment);

        return mapToResponse(updated);
    }

    @Override
    public PaymentResponse updatePaymentBalance(Long paymentId, Double newBalance) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + paymentId));

        payment.setBalance(BigDecimal.valueOf(newBalance));

        // If balance is now 0, automatically mark as paid and set paymentDate
        if (payment.getBalance().compareTo(BigDecimal.ZERO) == 0) {
            payment.setPaid(true);
            payment.setPaymentDate(LocalDate.now());
        }

        Payment updated = paymentRepository.save(payment);
        return mapToResponse(updated);
    }


    // Helper mapper
    private PaymentResponse mapToResponse(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getTenant().getId(),
                payment.getBalance(),
                payment.getPaid(),
                payment.getPaymentDate(),
                payment.getDueDate()
        );
    }
}
