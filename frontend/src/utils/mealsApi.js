const API_BASE_URL = 'http://localhost:8081/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const addMeal = async (mealData) => {
    const response = await fetch(`${API_BASE_URL}/meals`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(mealData)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add meal');
    }
    return response.json();
};

export const getUserMeals = async () => {
    const response = await fetch(`${API_BASE_URL}/meals`, {
        method: 'GET',
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch meals');
    return response.json();
};

export const getMealsByDateRange = async (startDate, endDate) => {
    const response = await fetch(
        `${API_BASE_URL}/meals/date-range?startDate=${startDate}&endDate=${endDate}`,
        {
            method: 'GET',
            headers: getAuthHeader()
        }
    );
    if (!response.ok) throw new Error('Failed to fetch meals by date range');
    return response.json();
};

export const getDailyCalories = async (date) => {
    const response = await fetch(`${API_BASE_URL}/meals/daily-calories?date=${date}`, {
        method: 'GET',
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch daily calories');
    return response.json();
};

export const deleteMeal = async (id) => {
    const response = await fetch(`${API_BASE_URL}/meals/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to delete meal');
};

export const getIndianCuisineTemplates = async () => {
    const response = await fetch(`${API_BASE_URL}/meals/indian-cuisine/templates`, {
        method: 'GET',
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch Indian cuisine templates');
    return response.json();
};

export const getNorthIndianMeals = async () => {
    const response = await fetch(`${API_BASE_URL}/meals/indian-cuisine/north-indian`, {
        method: 'GET',
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch North Indian meals');
    return response.json();
};

export const getSouthIndianMeals = async () => {
    const response = await fetch(`${API_BASE_URL}/meals/indian-cuisine/south-indian`, {
        method: 'GET',
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch South Indian meals');
    return response.json();
};

export const getVegetarianMeals = async () => {
    const response = await fetch(`${API_BASE_URL}/meals/indian-cuisine/vegetarian`, {
        method: 'GET',
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch vegetarian meals');
    return response.json();
};

export const getBreakfastItems = async () => {
    const response = await fetch(`${API_BASE_URL}/meals/indian-cuisine/breakfast`, {
        method: 'GET',
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch breakfast items');
    return response.json();
};

export const getSnacks = async () => {
    const response = await fetch(`${API_BASE_URL}/meals/indian-cuisine/snacks`, {
        method: 'GET',
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch snacks');
    return response.json();
};
