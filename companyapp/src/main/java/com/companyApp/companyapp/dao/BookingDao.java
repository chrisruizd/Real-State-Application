package com.companyApp.companyapp.dao;

import com.companyApp.companyapp.model.Booking;
import com.companyApp.companyapp.model.Product;
import com.companyApp.companyapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingDao extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByUser(User user);
    boolean existsByUserAndProduct(User user, Product product);
    //boolean existsByUserIdAndPropertyId(Long userId, Long propertyId);
}
