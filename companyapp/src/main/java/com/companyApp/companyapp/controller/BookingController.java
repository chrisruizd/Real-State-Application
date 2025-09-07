package com.companyApp.companyapp.controller;

import com.companyApp.companyapp.dao.BookingDao;
import com.companyApp.companyapp.dao.ProductDao;
import com.companyApp.companyapp.dao.UserDao;
import com.companyApp.companyapp.dto.BookingRequest;
import com.companyApp.companyapp.dto.BookingResponse;
import com.companyApp.companyapp.dto.BookingStatusUpdateRequest;
import com.companyApp.companyapp.dto.UserBookingResponse;
import com.companyApp.companyapp.model.Booking;
import com.companyApp.companyapp.model.BookingStatus;
import com.companyApp.companyapp.model.Product;
import com.companyApp.companyapp.model.User;
import com.companyApp.companyapp.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;


import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request, Principal principal) {
        if (principal == null) {
            throw new RuntimeException("Principal is null - user not authenticated");
        }

        try {
            Booking booking = bookingService.createBooking(request, principal.getName());
            return ResponseEntity.ok(bookingService.mapToResponse(booking));
        }catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage()); // 409 Conflict
        }

    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        List<BookingResponse> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings); // must return List<>
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserBookings(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }

        List<BookingResponse> bookings = bookingService.getUserBookings(principal.getName());
        return ResponseEntity.ok(bookings);
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserBookingResponse>> getBookingsByUserId(@PathVariable Long userId) {
        List<UserBookingResponse> bookings = bookingService.getBookingsByUserId(userId);
        return ResponseEntity.ok(bookings); // Always returns a list
    }


//    @PutMapping("/{bookingId}/status")
//    public ResponseEntity<String> updateBookingStatus(@PathVariable Long bookingId,
//                                                      @RequestBody BookingStatusUpdateRequest request) {
//        bookingService.updateBookingStatus(bookingId, request.getStatus());
//        return ResponseEntity.ok("Status updated");
//    }

    @PutMapping("/{bookingId}/status")
    public ResponseEntity<String> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestParam BookingStatus status) {
        bookingService.updateBookingStatus(bookingId, status);
        return ResponseEntity.ok("Booking status updated.");
    }



}

