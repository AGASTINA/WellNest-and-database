const API_BASE_URL = 'http://localhost:8081/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

export const logWorkoutSession = async (sessionData) => {
    const response = await fetch(`${API_BASE_URL}/workout-sessions`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(sessionData)
    });
    if (!response.ok) throw new Error('Failed to log workout session');
    return response.json();
};

export const getUserSessions = async () => {
    const response = await fetch(`${API_BASE_URL}/workout-sessions`, {
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch workout sessions');
    return response.json();
};

export const getSessionsByDateRange = async (startDate, endDate) => {
    const response = await fetch(
        `${API_BASE_URL}/workout-sessions/date-range?startDate=${startDate}&endDate=${endDate}`,
        { headers: getAuthHeader() }
    );
    if (!response.ok) throw new Error('Failed to fetch sessions by date range');
    return response.json();
};

export const getCalorieSummary = async (date = null) => {
    const dateParam = date ? `?date=${date}` : '';
    const response = await fetch(`${API_BASE_URL}/meals/calorie-summary${dateParam}`, {
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch calorie summary');
    return response.json();
};
