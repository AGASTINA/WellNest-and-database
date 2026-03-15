package com.wellnest.controller;

import com.wellnest.dto.BmiResponseDto;
import com.wellnest.service.BmiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bmi")
public class BmiController {

    @Autowired
    private BmiService bmiService;

    @GetMapping("/calculate")
    public ResponseEntity<BmiResponseDto> getBmiRecommendations(
            @RequestParam int age,
            @RequestParam double height,
            @RequestParam double weight,
            @RequestParam String gender) {

        BmiResponseDto result = bmiService.calculateBmi(age, height, weight, gender);
        return ResponseEntity.ok(result);
    }
}
