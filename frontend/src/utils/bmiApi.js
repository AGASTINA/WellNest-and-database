import { getToken } from './auth';

import { API_BASE_URL as WELLNEST_API_BASE_URL } from './apiConfig';

const API_BASE_URL = `${WELLNEST_API_BASE_URL}/bmi`;

const getHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

const handleResponse = async (response) => {
    let data;
    try {
        data = await response.json();
    } catch (e) {
        const text = await response.text();
        console.error('Response is not valid JSON:', text);
        throw new Error('Invalid server response');
    }

    if (!response.ok) {
        throw new Error(data.message || `API Error: ${response.status}`);
    }
    return data;
};

const bmiApi = {
    calculateBmi: async (age, height, weight, gender) => {
        try {
            const url = new URL(`${API_BASE_URL}/calculate`);
            url.searchParams.append('age', age);
            url.searchParams.append('height', height);
            url.searchParams.append('weight', weight);
            url.searchParams.append('gender', gender);

            const response = await fetch(url, {
                method: 'GET',
                headers: getHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error calculating BMI:', error);
            throw error;
        }
    }
};

export default bmiApi;
