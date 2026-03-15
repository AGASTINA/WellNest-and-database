package com.wellnest.dto;

import java.util.List;
import java.util.Map;

public class BmiResponseDto {
    private double bmi;
    private String category;
    private String color;
    private String healthyRange;
    private int dailyCalories;
    private double waterLiters;
    private Map<String, Integer> macros;
    private Map<String, List<FoodItemDto>> foodRecommendations;

    public BmiResponseDto() {
    }

    // Getters and Setters
    public double getBmi() {
        return bmi;
    }

    public void setBmi(double bmi) {
        this.bmi = bmi;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getHealthyRange() {
        return healthyRange;
    }

    public void setHealthyRange(String healthyRange) {
        this.healthyRange = healthyRange;
    }

    public int getDailyCalories() {
        return dailyCalories;
    }

    public void setDailyCalories(int dailyCalories) {
        this.dailyCalories = dailyCalories;
    }

    public double getWaterLiters() {
        return waterLiters;
    }

    public void setWaterLiters(double waterLiters) {
        this.waterLiters = waterLiters;
    }

    public Map<String, Integer> getMacros() {
        return macros;
    }

    public void setMacros(Map<String, Integer> macros) {
        this.macros = macros;
    }

    public Map<String, List<FoodItemDto>> getFoodRecommendations() {
        return foodRecommendations;
    }

    public void setFoodRecommendations(Map<String, List<FoodItemDto>> foodRecommendations) {
        this.foodRecommendations = foodRecommendations;
    }
}
