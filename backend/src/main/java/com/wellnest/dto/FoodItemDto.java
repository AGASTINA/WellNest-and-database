package com.wellnest.dto;

public class FoodItemDto {
    private String name;
    private String icon;

    public FoodItemDto() {
    }

    public FoodItemDto(String name, String icon) {
        this.name = name;
        this.icon = icon;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}
