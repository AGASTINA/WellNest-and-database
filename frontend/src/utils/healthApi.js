import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

// Doctor API
export const getDoctors = async () => {
  const response = await axios.get(`${API_URL}/doctors`, { headers: getAuthHeader() });
  return response.data;
};

export const getDoctorById = async (id) => {
  const response = await axios.get(`${API_URL}/doctors/${id}`, { headers: getAuthHeader() });
  return response.data;
};

export const searchDoctors = async (keyword) => {
  const response = await axios.get(`${API_URL}/doctors/search`, {
    params: { keyword },
    headers: getAuthHeader()
  });
  return response.data;
};

export const getNearbyDoctors = async (latitude, longitude, radius = 10) => {
  const response = await axios.get(`${API_URL}/doctors/nearby`, {
    params: { latitude, longitude, radius },
    headers: getAuthHeader()
  });
  return response.data;
};

// Hospital API
export const getHospitals = async () => {
  const response = await axios.get(`${API_URL}/hospitals`, { headers: getAuthHeader() });
  return response.data;
};

export const getNearbyHospitals = async (latitude, longitude, radius = 10) => {
  const response = await axios.get(`${API_URL}/hospitals/nearby`, {
    params: { latitude, longitude, radius },
    headers: getAuthHeader()
  });
  return response.data;
};

export const getNearbyEmergencyHospitals = async (latitude, longitude, radius = 10) => {
  const response = await axios.get(`${API_URL}/hospitals/nearby/emergency`, {
    params: { latitude, longitude, radius },
    headers: getAuthHeader()
  });
  return response.data;
};

// Consultation API
export const bookConsultation = async (consultationData) => {
  const response = await axios.post(`${API_URL}/consultations`, consultationData, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getConsultations = async () => {
  const response = await axios.get(`${API_URL}/consultations`, { headers: getAuthHeader() });
  return response.data;
};

export const cancelConsultation = async (id) => {
  const response = await axios.put(`${API_URL}/consultations/${id}/cancel`, {}, {
    headers: getAuthHeader()
  });
  return response.data;
};

// Medical Records API
export const getMedicalRecords = async () => {
  const response = await axios.get(`${API_URL}/medical-records`, { headers: getAuthHeader() });
  return response.data;
};

export const createMedicalRecord = async (recordData) => {
  const response = await axios.post(`${API_URL}/medical-records`, recordData, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const updateMedicalRecord = async (id, recordData) => {
  const response = await axios.put(`${API_URL}/medical-records/${id}`, recordData, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const deleteMedicalRecord = async (id) => {
  const response = await axios.delete(`${API_URL}/medical-records/${id}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

// Health Metrics API
export const getHealthMetrics = async () => {
  const response = await axios.get(`${API_URL}/health-metrics`, { headers: getAuthHeader() });
  return response.data;
};

export const getLatestHealthMetrics = async () => {
  const response = await axios.get(`${API_URL}/health-metrics/latest`, { headers: getAuthHeader() });
  return response.data;
};

export const recordHealthMetrics = async (metricsData) => {
  const response = await axios.post(`${API_URL}/health-metrics`, metricsData, {
    headers: getAuthHeader()
  });
  return response.data;
};
