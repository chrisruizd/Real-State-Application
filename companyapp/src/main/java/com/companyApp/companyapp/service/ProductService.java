package com.companyApp.companyapp.service;

import com.companyApp.companyapp.model.Product;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ProductService {

    List<Product> getAllProducts();

    Product getProductById(int id);

    Product addProduct(Product product, MultipartFile image) throws IOException;

    Product updatedProduct(Product product, MultipartFile image) throws IOException;

    void deleteProduct(int id);

    List<Product> searchProducts(String keyword);
}
