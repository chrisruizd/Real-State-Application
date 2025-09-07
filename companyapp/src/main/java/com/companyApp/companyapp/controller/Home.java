package com.companyApp.companyapp.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class Home {

    @GetMapping("/home")
    public String homeDashboard(){
        return "Welcome";
    }
}
