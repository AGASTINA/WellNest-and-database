package com.wellnest.service;

import com.wellnest.dto.BmiResponseDto;
import com.wellnest.dto.FoodItemDto;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BmiService {

    public BmiResponseDto calculateBmi(int age, double heightCm, double weightKg, String gender) {
        double heightM = heightCm / 100.0;
        double bmi = weightKg / (heightM * heightM);

        BmiResponseDto response = new BmiResponseDto();
        response.setBmi(Math.round(bmi * 10.0) / 10.0);

        // Determine category and color
        String category;
        String color;
        if (bmi < 18.5) {
            category = "UNDERWEIGHT";
            color = "#3b82f6";
        } else if (bmi < 25) {
            category = "NORMAL";
            color = "#10b981";
        } else if (bmi < 30) {
            category = "OVERWEIGHT";
            color = "#f59e0b";
        } else {
            category = "OBESE";
            color = "#ef4444";
        }
        response.setCategory(category);
        response.setColor(color);

        // Healthy weight range
        double minWeight = 18.5 * (heightM * heightM);
        double maxWeight = 24.9 * (heightM * heightM);
        response.setHealthyRange(String.format("%.1f–%.1fkg", minWeight, maxWeight));

        // BMR and TDEE (Sedentary)
        double bmr;
        if ("male".equalsIgnoreCase(gender)) {
            bmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age);
        } else {
            bmr = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age);
        }
        int dailyCalories = (int) Math.round(bmr * 1.2);
        response.setDailyCalories(dailyCalories);

        // Water intake
        response.setWaterLiters(Math.round(weightKg * 0.033 * 10.0) / 10.0);

        // Macros (40/30/30)
        Map<String, Integer> macros = new HashMap<>();
        macros.put("carbs", (int) Math.round((dailyCalories * 0.4) / 4));
        macros.put("protein", (int) Math.round((dailyCalories * 0.3) / 4));
        macros.put("fats", (int) Math.round((dailyCalories * 0.3) / 9));
        response.setMacros(macros);

        // Dynamic Food Recommendations
        Map<String, List<FoodItemDto>> foods = new HashMap<>();
        List<FoodItemDto> proteins = new ArrayList<>();
        List<FoodItemDto> carbsList = new ArrayList<>();
        List<FoodItemDto> fatsList = new ArrayList<>();

        if (bmi < 18.5) {
            // Underweight: Nutrient dense, higher calorie
            proteins.add(new FoodItemDto("Whole Milk / Paneer", "🥛"));
            proteins.add(new FoodItemDto("Eggs and Meat", "🍗"));
            proteins.add(new FoodItemDto("Lentil Soup", "🥣"));

            carbsList.add(new FoodItemDto("Sweet Potato", "🥔"));
            carbsList.add(new FoodItemDto("Banana / Mango", "🍌"));
            carbsList.add(new FoodItemDto("Brown Rice", "🍚"));

            fatsList.add(new FoodItemDto("Walnuts / Almonds", "🥜"));
            fatsList.add(new FoodItemDto("Avocado", "🥑"));
            fatsList.add(new FoodItemDto("Peanut Butter", "🍯"));
        } else if (bmi < 25) {
            // Normal: Balanced
            proteins.add(new FoodItemDto("Greek Yogurt", "🍦"));
            proteins.add(new FoodItemDto("Grilled Chicken", "🍲"));
            proteins.add(new FoodItemDto("Tofu / Tempeh", "🧊"));

            carbsList.add(new FoodItemDto("Quinoa", "🌾"));
            carbsList.add(new FoodItemDto("Oats", "🥣"));
            carbsList.add(new FoodItemDto("Whole Wheat Roti", "🫓"));

            fatsList.add(new FoodItemDto("Chia Seeds", "🌱"));
            fatsList.add(new FoodItemDto("Olive Oil", "🫒"));
            fatsList.add(new FoodItemDto("Mixed Berries", "🫐"));
        } else {
            // Overweight/Obese: Low calorie, high fiber/protein
            proteins.add(new FoodItemDto("Egg Whites", "🥚"));
            proteins.add(new FoodItemDto("Lean Fish", "🐟"));
            proteins.add(new FoodItemDto("Soya Chunks", "🧆"));

            carbsList.add(new FoodItemDto("Leafy Greens", "🥬"));
            carbsList.add(new FoodItemDto("Cauliflower Rice", "🥦"));
            carbsList.add(new FoodItemDto("Broccoli", "🌳"));

            fatsList.add(new FoodItemDto("Flax Seeds", "🌾"));
            fatsList.add(new FoodItemDto("Pumpkin Seeds", "🎃"));
            fatsList.add(new FoodItemDto("Green Tea", "🍵"));
        }

        foods.put("proteins", proteins);
        foods.put("carbs", carbsList);
        foods.put("fats", fatsList);

        response.setFoodRecommendations(foods);

        return response;
    }
}
