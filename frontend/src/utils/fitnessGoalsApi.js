const API_BASE_URL = 'http://localhost:8081/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const createGoal = async (goalData) => {
    const response = await fetch(`${API_BASE_URL}/fitness-goals`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(goalData)
    });
    if (!response.ok) throw new Error('Failed to create goal');
    return response.json();
};

export const getUserGoals = async () => {
    const response = await fetch(`${API_BASE_URL}/fitness-goals`, {
        method: 'GET',
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch goals');
    return response.json();
};

export const getActiveGoals = async () => {
    const response = await fetch(`${API_BASE_URL}/fitness-goals/active`, {
        method: 'GET',
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch active goals');
    return response.json();
};

export const updateGoal = async (id, goalData) => {
    const response = await fetch(`${API_BASE_URL}/fitness-goals/${id}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(goalData)
    });
    if (!response.ok) throw new Error('Failed to update goal');
    return response.json();
};

export const deleteGoal = async (id) => {
    const response = await fetch(`${API_BASE_URL}/fitness-goals/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to delete goal');
};
