package com.companyApp.companyapp.service.Impl;

import com.companyApp.companyapp.dao.ProductDao;
import com.companyApp.companyapp.model.Product;
import com.companyApp.companyapp.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductDao productDao;

    @Override
    public List<Product> getAllProducts(){
        return productDao.findAll();
    }

    public Product getProductById(Long id){
        return productDao.findById(id).orElse(null);
    }

    public Product addProduct(Product product, MultipartFile image) throws IOException {
        product.setImageName(image.getOriginalFilename());
        product.setImageType(image.getContentType());
        product.setImageData(image.getBytes());

        return productDao.save(product);
    }

    public Product updatedProduct(Product product, MultipartFile image) throws IOException {
        product.setImageName(image.getOriginalFilename());
        product.setImageType(image.getContentType());
        product.setImageData(image.getBytes());

        return productDao.save(product);
    }

    public void deleteProduct(Long id){
        productDao.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Product> searchProducts(String keyword){
        return productDao.searchProducts(keyword);
    }
}
