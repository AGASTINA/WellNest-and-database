package com.wellnest.constants;

import java.util.HashMap;
import java.util.Map;

public class IndianCuisineConstants {

    // Meal template structure: name -> {calories, protein, carbs, fat, fiber, isVeg, isVegan}
    
    public static final Map<String, MealTemplate> NORTH_INDIAN_MEALS = new HashMap<>();
    public static final Map<String, MealTemplate> SOUTH_INDIAN_MEALS = new HashMap<>();
    public static final Map<String, MealTemplate> VEGETARIAN_MEALS = new HashMap<>();
    public static final Map<String, MealTemplate> NON_VEGETARIAN_MEALS = new HashMap<>();
    
    static {
        // North Indian Non-Vegetarian
        NORTH_INDIAN_MEALS.put("Butter Chicken", 
            new MealTemplate("Butter Chicken", 450, 28, 18, 32, 2, false, false, "1 serving (300g)"));
        NORTH_INDIAN_MEALS.put("Chicken Tikka Masala", 
            new MealTemplate("Chicken Tikka Masala", 420, 32, 15, 28, 3, false, false, "1 serving (300g)"));
        NORTH_INDIAN_MEALS.put("Rogan Josh", 
            new MealTemplate("Rogan Josh", 480, 30, 12, 35, 2, false, false, "1 serving (300g)"));
        NORTH_INDIAN_MEALS.put("Tandoori Chicken", 
            new MealTemplate("Tandoori Chicken", 280, 38, 5, 12, 1, false, false, "1 serving (250g)"));
        
        // North Indian Vegetarian
        NORTH_INDIAN_MEALS.put("Paneer Butter Masala", 
            new MealTemplate("Paneer Butter Masala", 380, 15, 22, 26, 4, true, false, "1 serving (300g)"));
        NORTH_INDIAN_MEALS.put("Dal Makhani", 
            new MealTemplate("Dal Makhani", 400, 18, 45, 16, 12, true, false, "1 serving (300g)"));
        NORTH_INDIAN_MEALS.put("Chole Bhature", 
            new MealTemplate("Chole Bhature", 550, 15, 68, 24, 10, true, false, "2 bhature + chickpea curry"));
        NORTH_INDIAN_MEALS.put("Aloo Gobi", 
            new MealTemplate("Aloo Gobi", 220, 5, 32, 8, 6, true, true, "1 serving (250g)"));
        
        // South Indian
        SOUTH_INDIAN_MEALS.put("Masala Dosa", 
            new MealTemplate("Masala Dosa", 380, 10, 58, 12, 5, true, true, "1 dosa with potato filling"));
        SOUTH_INDIAN_MEALS.put("Idli Sambar", 
            new MealTemplate("Idli Sambar", 250, 8, 48, 3, 6, true, true, "3 idlis with sambar"));
        SOUTH_INDIAN_MEALS.put("Uttapam", 
            new MealTemplate("Uttapam", 320, 9, 52, 8, 4, true, true, "1 large uttapam"));
        SOUTH_INDIAN_MEALS.put("Bisi Bele Bath", 
            new MealTemplate("Bisi Bele Bath", 420, 12, 62, 14, 8, true, true, "1 serving (350g)"));
        SOUTH_INDIAN_MEALS.put("Fish Curry (Kerala Style)", 
            new MealTemplate("Fish Curry (Kerala Style)", 320, 28, 8, 20, 2, false, false, "1 serving (300g)"));
        
        // Vegetarian Specialties
        VEGETARIAN_MEALS.put("Palak Paneer", 
            new MealTemplate("Palak Paneer", 280, 14, 12, 20, 5, true, false, "1 serving (300g)"));
        VEGETARIAN_MEALS.put("Rajma Chawal", 
            new MealTemplate("Rajma Chawal", 480, 16, 72, 12, 14, true, true, "1 serving rice + kidney bean curry"));
        VEGETARIAN_MEALS.put("Vegetable Biryani", 
            new MealTemplate("Vegetable Biryani", 420, 10, 64, 14, 6, true, true, "1 serving (350g)"));
        VEGETARIAN_MEALS.put("Kadai Paneer", 
            new MealTemplate("Kadai Paneer", 350, 16, 18, 24, 4, true, false, "1 serving (300g)"));
        VEGETARIAN_MEALS.put("Mixed Vegetable Curry", 
            new MealTemplate("Mixed Vegetable Curry", 180, 6, 24, 7, 8, true, true, "1 serving (250g)"));
        
        // Non-Vegetarian Specialties
        NON_VEGETARIAN_MEALS.put("Chicken Biryani", 
            new MealTemplate("Chicken Biryani", 520, 28, 58, 18, 3, false, false, "1 serving (400g)"));
        NON_VEGETARIAN_MEALS.put("Mutton Biryani", 
            new MealTemplate("Mutton Biryani", 580, 32, 60, 22, 3, false, false, "1 serving (400g)"));
        NON_VEGETARIAN_MEALS.put("Prawn Curry", 
            new MealTemplate("Prawn Curry", 280, 26, 10, 15, 2, false, false, "1 serving (250g)"));
        NON_VEGETARIAN_MEALS.put("Egg Curry", 
            new MealTemplate("Egg Curry", 320, 18, 12, 22, 3, false, false, "2 eggs in curry"));
        NON_VEGETARIAN_MEALS.put("Chicken Korma", 
            new MealTemplate("Chicken Korma", 460, 30, 14, 32, 2, false, false, "1 serving (300g)"));
    }
    
    // Breakfast items
    public static final Map<String, MealTemplate> BREAKFAST_ITEMS = new HashMap<>();
    static {
        BREAKFAST_ITEMS.put("Poha", 
            new MealTemplate("Poha", 250, 6, 42, 7, 4, true, true, "1 bowl (200g)"));
        BREAKFAST_ITEMS.put("Upma", 
            new MealTemplate("Upma", 280, 7, 48, 8, 5, true, true, "1 bowl (200g)"));
        BREAKFAST_ITEMS.put("Paratha with Curd", 
            new MealTemplate("Paratha with Curd", 380, 10, 52, 14, 3, true, false, "2 parathas + curd"));
        BREAKFAST_ITEMS.put("Boiled Eggs (2)", 
            new MealTemplate("Boiled Eggs (2)", 140, 12, 2, 10, 0, false, false, "2 large eggs"));
    }
    
    // Snacks
    public static final Map<String, MealTemplate> SNACKS = new HashMap<>();
    static {
        SNACKS.put("Samosa (2 pieces)", 
            new MealTemplate("Samosa (2 pieces)", 320, 6, 38, 16, 4, true, true, "2 medium samosas"));
        SNACKS.put("Pakora (6 pieces)", 
            new MealTemplate("Pakora (6 pieces)", 280, 8, 32, 14, 5, true, true, "6 vegetable pakoras"));
        SNACKS.put("Dhokla", 
            new MealTemplate("Dhokla", 180, 6, 30, 4, 3, true, true, "2 pieces (150g)"));
        SNACKS.put("Vada Pav", 
            new MealTemplate("Vada Pav", 320, 7, 48, 12, 4, true, true, "1 vada pav"));
    }
    
    // Staples (Rice, Roti, etc.)
    public static final Map<String, MealTemplate> STAPLES = new HashMap<>();
    static {
        STAPLES.put("Steamed Rice (1 cup)", 
            new MealTemplate("Steamed Rice (1 cup)", 200, 4, 44, 0, 1, true, true, "1 cup cooked"));
        STAPLES.put("Roti (1 piece)", 
            new MealTemplate("Roti (1 piece)", 80, 3, 15, 1, 2, true, true, "1 medium roti"));
        STAPLES.put("Naan (1 piece)", 
            new MealTemplate("Naan (1 piece)", 150, 4, 28, 3, 1, true, false, "1 medium naan"));
        STAPLES.put("Jeera Rice (1 cup)", 
            new MealTemplate("Jeera Rice (1 cup)", 220, 4, 46, 2, 1, true, true, "1 cup cooked"));
    }
    
    public static class MealTemplate {
        private String name;
        private int calories;
        private int proteinGrams;
        private int carbsGrams;
        private int fatGrams;
        private int fiberGrams;
        private boolean isVegetarian;
        private boolean isVegan;
        private String portionSize;
        
        public MealTemplate(String name, int calories, int proteinGrams, int carbsGrams, 
                          int fatGrams, int fiberGrams, boolean isVegetarian, 
                          boolean isVegan, String portionSize) {
            this.name = name;
            this.calories = calories;
            this.proteinGrams = proteinGrams;
            this.carbsGrams = carbsGrams;
            this.fatGrams = fatGrams;
            this.fiberGrams = fiberGrams;
            this.isVegetarian = isVegetarian;
            this.isVegan = isVegan;
            this.portionSize = portionSize;
        }
        
        // Getters
        public String getName() { return name; }
        public int getCalories() { return calories; }
        public int getProteinGrams() { return proteinGrams; }
        public int getCarbsGrams() { return carbsGrams; }
        public int getFatGrams() { return fatGrams; }
        public int getFiberGrams() { return fiberGrams; }
        public boolean isVegetarian() { return isVegetarian; }
        public boolean isVegan() { return isVegan; }
        public String getPortionSize() { return portionSize; }
    }
    
    // Utility method to get all meals
    public static Map<String, MealTemplate> getAllMeals() {
        Map<String, MealTemplate> allMeals = new HashMap<>();
        allMeals.putAll(NORTH_INDIAN_MEALS);
        allMeals.putAll(SOUTH_INDIAN_MEALS);
        allMeals.putAll(VEGETARIAN_MEALS);
        allMeals.putAll(NON_VEGETARIAN_MEALS);
        allMeals.putAll(BREAKFAST_ITEMS);
        allMeals.putAll(SNACKS);
        allMeals.putAll(STAPLES);
        return allMeals;
    }
}
