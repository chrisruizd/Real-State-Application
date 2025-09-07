package com.companyApp.companyapp.service.Impl;

import com.companyApp.companyapp.dao.BookingDao;
import com.companyApp.companyapp.dao.ProductDao;
import com.companyApp.companyapp.dao.UserDao;
import com.companyApp.companyapp.dto.BookingRequest;
import com.companyApp.companyapp.dto.BookingResponse;
import com.companyApp.companyapp.dto.UserBookingResponse;
import com.companyApp.companyapp.exceptions.ResourceNotFoundException;
import com.companyApp.companyapp.model.Booking;
import com.companyApp.companyapp.model.BookingStatus;
import com.companyApp.companyapp.model.Product;
import com.companyApp.companyapp.model.User;
import com.companyApp.companyapp.service.BookingService;
import com.companyApp.companyapp.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingDao bookingRepository;

    @Autowired
    private UserDao userRepository;

    @Autowired
    private ProductDao productRepository;

    public Booking createBooking(BookingRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // ✅ Check if booking already exists for this user + product
        boolean exists = bookingRepository.existsByUserAndProduct(user, product);
        if (exists) {
            throw new IllegalStateException("You already booked this property");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setProduct(product);
        booking.setTourDate(request.getTourDate());
        booking.setStatus(BookingStatus.PENDING);

        return bookingRepository.save(booking);
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getUserBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return bookingRepository.findByUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

//    public Booking updateBookingStatus(Long bookingId, BookingStatus status) {
//        Booking booking = bookingRepository.findById(bookingId)
//                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
//
//        booking.setStatus(status);
//        return bookingRepository.save(booking);
//    }

    @Transactional(readOnly = true)
    public List<UserBookingResponse> getBookingsByUserId(Long userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        return bookings.stream()
                .map(this::mapToUserBookingResponse) // <-- use the correct mapper
                .collect(Collectors.toList());
    }

    public BookingResponse mapToResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getUser().getFullName(),
                booking.getUser().getEmail(),
                booking.getProduct().getAddress(),
                booking.getProduct().getCity(),
                booking.getProduct().getState(),
                booking.getTourDate(),
                booking.getStatus()
        );
    }

    private UserBookingResponse mapToUserBookingResponse(Booking booking) {
        if (booking.getProduct() == null) {
            throw new IllegalStateException("Booking " + booking.getId() + " has no product linked!");
        }

        return new UserBookingResponse(
                booking.getId(),                       // bookingId
                booking.getProduct().getId(),          // productId
                booking.getProduct().getAddress(),     // address
                booking.getProduct().getCity(),        // city
                booking.getProduct().getState(),       // state
                booking.getTourDate(),                 // tourDate
                booking.getStatus()                    // status
        );
    }


    public void updateBookingStatus(Long bookingId, BookingStatus newStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(newStatus);
        bookingRepository.save(booking);
    }



}

