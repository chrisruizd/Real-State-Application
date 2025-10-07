package com.companyApp.companyapp.controller;


import com.companyApp.companyapp.dao.TenantDao;
import com.companyApp.companyapp.dto.PaymentResponse;
import com.companyApp.companyapp.model.Tenant;
import com.companyApp.companyapp.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    private final PaymentService paymentService;
    private final TenantDao tenantRepository;

    public PaymentController(PaymentService paymentService, TenantDao tenantRepository) {
        this.paymentService = paymentService;
        this.tenantRepository = tenantRepository;
    }

    @GetMapping
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByTenant(@PathVariable Long tenantId) {
        return ResponseEntity.ok(paymentService.getPaymentsByTenantId(tenantId));
    }

    @PutMapping("/{paymentId}/mark-paid")
    public ResponseEntity<PaymentResponse> markPaymentAsPaid(@PathVariable Long paymentId) {
        return ResponseEntity.ok(paymentService.markAsPaid(paymentId));
    }

    @PutMapping("/{paymentId}/update-balance")
    public ResponseEntity<PaymentResponse> updatePaymentBalance(
            @PathVariable Long paymentId,
            @RequestBody Map<String, Double> request
    ) {
        Double newBalance = request.get("balance");
        return ResponseEntity.ok(paymentService.updatePaymentBalance(paymentId, newBalance));
    }

    @PostMapping("/create/all")
    public ResponseEntity<String> createPaymentsForAllTenants() {
        List<Tenant> tenants = tenantRepository.findAll();
        if (tenants.isEmpty()) {
            return ResponseEntity.badRequest().body("No tenants found");
        }

        int count = 0;
        for (Tenant tenant : tenants) {
            paymentService.createInitialPayment(tenant);
            count++;
        }

        return ResponseEntity.ok("✅ Created new payments for " + count + " tenants.");
    }


//    @PostMapping("/create/{tenantId}")
//    public ResponseEntity<PaymentResponse> createPaymentForTenant(@PathVariable Long tenantId) {
//        Tenant tenant = tenantRepository.findById(tenantId)
//                .orElseThrow(() -> new RuntimeException("Tenant not found with ID: " + tenantId));
//
//        var payment = paymentService.createInitialPayment(tenant);
//
//        PaymentResponse response = new PaymentResponse(
//                payment.getId(),
//                tenant.getId(),
//                payment.getBalance(),
//                payment.getPaid(),
//                payment.getPaymentDate(),
//                payment.getDueDate()
//        );
//
//        return ResponseEntity.ok(response);
//    }

}
