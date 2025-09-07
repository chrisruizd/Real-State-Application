package com.companyApp.companyapp.service;

import com.companyApp.companyapp.dto.BookingRequest;
import com.companyApp.companyapp.dto.BookingResponse;
import com.companyApp.companyapp.dto.UserBookingResponse;
import com.companyApp.companyapp.model.Booking;
import com.companyApp.companyapp.model.BookingStatus;
import com.companyApp.companyapp.model.User;

import java.util.List;

public interface BookingService {

//    Booking createBooking(BookingRequest request);

    List<BookingResponse> getAllBookings();

    Booking createBooking(BookingRequest request, String userEmail);

    List<BookingResponse> getUserBookings(String userEmail);

    //Booking updateBookingStatus(Long bookingId, BookingStatus status);

    BookingResponse mapToResponse(Booking booking);

    //List<Booking> findByUserId(Long userId);

    //List<Booking> findByUser(User user);

    List<UserBookingResponse> getBookingsByUserId(Long userId);

    void updateBookingStatus(Long bookingId, BookingStatus newStatus);
}
