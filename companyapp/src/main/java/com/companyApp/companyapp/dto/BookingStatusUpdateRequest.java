package com.companyApp.companyapp.dto;

import com.companyApp.companyapp.model.BookingStatus;
import lombok.Data;

@Data
public class BookingStatusUpdateRequest {
    private BookingStatus status;

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }
}

