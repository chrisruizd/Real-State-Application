package com.companyApp.companyapp.dto;

import com.companyApp.companyapp.model.BookingStatus;

import java.time.LocalDate;

public class UserBookingResponse {
    private Long bookingId;
    private Long productId;
    private String address;
    private String city;
    private String state;
    private LocalDate tourDate;
    private BookingStatus status;

    public UserBookingResponse(Long bookingId, Long productId, String address, String city, String state,
                               LocalDate tourDate, BookingStatus status) {
        this.bookingId = bookingId;
        this.productId = productId;
        this.address = address;
        this.city = city;
        this.state = state;
        this.tourDate = tourDate;
        this.status = status;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public LocalDate getTourDate() {
        return tourDate;
    }

    public void setTourDate(LocalDate tourDate) {
        this.tourDate = tourDate;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }
}
