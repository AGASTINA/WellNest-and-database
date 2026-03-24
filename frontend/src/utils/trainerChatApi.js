import { getToken } from './auth';

const API_BASE_URL = 'http://localhost:8081/api/trainer-chat';

const getHeaders = () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const handleResponse = async (response) => {
  let text = '';
  let data = {};

  try {
    text = await response.text();
    data = text ? JSON.parse(text) : {};
  } catch {
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    throw new Error('Invalid server response');
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Session expired. Please log in again.');
    }
    throw new Error(data.message || `API Error: ${response.status}`);
  }

  return data;
};

export const trainerChatApi = {
  getConversation: async (trainerId) => {
    const response = await fetch(`${API_BASE_URL}/${trainerId}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  sendMessage: async (trainerId, payload) => {
    const response = await fetch(`${API_BASE_URL}/${trainerId}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(response);
  },

  getTrainerThreads: async (trainerId) => {
    const response = await fetch(`${API_BASE_URL}/${trainerId}/threads`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getConversationForTrainer: async (trainerId, userId) => {
    const response = await fetch(`${API_BASE_URL}/${trainerId}/user/${userId}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  sendTrainerReply: async (trainerId, userId, payload) => {
    const response = await fetch(`${API_BASE_URL}/${trainerId}/user/${userId}/reply`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(response);
  }
};

export default trainerChatApi;
