package com.wellnest.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardingController {

    @GetMapping(value = {
        "/",
        "/login",
        "/signup",
        "/forgot-password",
        "/dashboard",
        "/fitness-goals",
        "/health-metrics",
        "/meal-tracker",
        "/sleep-tracker",
        "/medical-records",
        "/membership",
        "/consult-doctor",
        "/trainers",
        "/admin"
    })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
