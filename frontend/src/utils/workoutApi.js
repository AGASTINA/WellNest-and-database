import { getToken } from './auth';

const API_BASE_URL = 'http://localhost:8081/api/workout-plans';

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const handleResponse = async (response) => {
  // Try to parse JSON first
  let data;
  try {
    data = await response.json();
  } catch (e) {
    // If JSON parsing fails, return the text
    const text = await response.text();
    console.error('Response is not valid JSON:', text);
    throw new Error('Invalid server response: ' + text.substring(0, 100));
  }

  if (!response.ok) {
    throw new Error(data.message || `API Error: ${response.status}`);
  }
  return data;
};

export const workoutApi = {
  // Get all workout plans for the user
  getWorkoutPlans: async () => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching workout plans:', error);
      throw error;
    }
  },

  // Get active workout plans
  getActiveWorkoutPlans: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/active`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching active workout plans:', error);
      throw error;
    }
  },

  // Get a specific workout plan
  getWorkoutPlanById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching workout plan:', error);
      throw error;
    }
  },

  // Create a new workout plan
  createWorkoutPlan: async (workoutData) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(workoutData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating workout plan:', error);
      throw error;
    }
  },

  // Update a workout plan
  updateWorkoutPlan: async (id, workoutData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(workoutData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating workout plan:', error);
      throw error;
    }
  },

  // Delete a workout plan
  deleteWorkoutPlan: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!response.ok) {
        throw new Error(`Error deleting workout plan: ${response.status}`);
      }
      return { success: true };
    } catch (error) {
      console.error('Error deleting workout plan:', error);
      throw error;
    }
  },

  // Mark a workout plan as complete
  completeWorkoutPlan: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/complete`, {
        method: 'POST',
        headers: getHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error completing workout plan:', error);
      throw error;
    }
  }
};

export default workoutApi;
