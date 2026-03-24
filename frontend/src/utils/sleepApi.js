const API_URL = 'http://localhost:8081/api/sleep';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const logSleep = async (sleepData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(sleepData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to log sleep');
  }
  return response.json();
};

export const updateSleep = async (sleepId, sleepData) => {
  const response = await fetch(`${API_URL}/${sleepId}`, {
    method: 'PUT',
    headers: getAuthHeader(),
    body: JSON.stringify(sleepData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update sleep log');
  }
  return response.json();
};

export const getUserSleepLogs = async () => {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: getAuthHeader()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch sleep logs');
  }
  return response.json();
};

export const getSleepByDate = async (date) => {
  const response = await fetch(`${API_URL}/date/${date}`, {
    method: 'GET',
    headers: getAuthHeader()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch sleep log');
  }
  return response.json();
};

export const getSleepLogsByDateRange = async (startDate, endDate) => {
  const response = await fetch(`${API_URL}/date-range?startDate=${startDate}&endDate=${endDate}`, {
    method: 'GET',
    headers: getAuthHeader()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch sleep logs');
  }
  return response.json();
};

export const deleteSleep = async (sleepId) => {
  const response = await fetch(`${API_URL}/${sleepId}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  if (!response.ok) {
    throw new Error('Failed to delete sleep log');
  }
  return response.ok;
};

export const getAverageSleepHours = async (startDate, endDate) => {
  const response = await fetch(`${API_URL}/stats/average-hours?startDate=${startDate}&endDate=${endDate}`, {
    method: 'GET',
    headers: getAuthHeader()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch average sleep hours');
  }
  return response.json();
};

export const getAverageSleepQuality = async (startDate, endDate) => {
  const response = await fetch(`${API_URL}/stats/average-quality?startDate=${startDate}&endDate=${endDate}`, {
    method: 'GET',
    headers: getAuthHeader()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch average sleep quality');
  }
  return response.json();
};

export const getTotalWaterIntake = async (startDate, endDate) => {
  const response = await fetch(`${API_URL}/stats/water-intake?startDate=${startDate}&endDate=${endDate}`, {
    method: 'GET',
    headers: getAuthHeader()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch water intake');
  }
  return response.json();
};
