import { getToken } from './auth';

const API_BASE_URL = 'http://localhost:8081';

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const handleResponse = async (response) => {
  let data;
  let text;
  try {
    text = await response.text();
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    console.error('Response parsing error:', e, 'Response text:', text);
    throw new Error('Invalid server response');
  }

  if (!response.ok) {
    console.error('API Error:', response.status, data);
    throw new Error(data.message || `API Error: ${response.status}`);
  }
  return data;
};

const buildQueryString = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, value);
    }
  });
  return query.toString();
};

// Doctor APIs
export const getAllDoctors = async () => {
  const response = await fetch(`${API_BASE_URL}/api/doctors`, {
    method: 'GET',
    headers: getHeaders()
  });
  return handleResponse(response);
};

export const getDoctorById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/doctors/${id}`, {
    method: 'GET',
    headers: getHeaders()
  });
  return handleResponse(response);
};

export const searchDoctors = async (keyword) => {
  const query = buildQueryString({ keyword });
  const response = await fetch(`${API_BASE_URL}/api/doctors/search?${query}`, {
    method: 'GET',
    headers: getHeaders()
  });
  return handleResponse(response);
};

export const findNearbyDoctors = async (latitude, longitude, radius = 10) => {
  const query = buildQueryString({ latitude, longitude, radius });
  const response = await fetch(`${API_BASE_URL}/api/doctors/nearby?${query}`, {
    method: 'GET',
    headers: getHeaders()
  });
  return handleResponse(response);
};

export const findNearbyDoctorsBySpecialization = async (latitude, longitude, specialization, radius = 10) => {
  const query = buildQueryString({ latitude, longitude, specialization, radius });
  const response = await fetch(`${API_BASE_URL}/api/doctors/nearby/specialization?${query}`, {
    method: 'GET',
    headers: getHeaders()
  });
  return handleResponse(response);
};

// Hospital APIs
export const getAllHospitals = async () => {
  const response = await fetch(`${API_BASE_URL}/api/hospitals`, {
    method: 'GET',
    headers: getHeaders()
  });
  return handleResponse(response);
};

export const getHospitalById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/hospitals/${id}`, {
    method: 'GET',
    headers: getHeaders()
  });
  return handleResponse(response);
};

export const searchHospitals = async (keyword) => {
  const query = buildQueryString({ keyword });
  const response = await fetch(`${API_BASE_URL}/api/hospitals/search?${query}`, {
    method: 'GET',
    headers: getHeaders()
  });
  return handleResponse(response);
};

export const findNearbyHospitals = async (latitude, longitude, radius = 10) => {
  const query = buildQueryString({ latitude, longitude, radius });
  const response = await fetch(`${API_BASE_URL}/api/hospitals/nearby?${query}`, {
    method: 'GET',
    headers: getHeaders()
  });
  return handleResponse(response);
};

export const findNearbyEmergencyHospitals = async (latitude, longitude, radius = 10) => {
  const query = buildQueryString({ latitude, longitude, radius });
  const response = await fetch(`${API_BASE_URL}/api/hospitals/nearby/emergency?${query}`, {
    method: 'GET',
    headers: getHeaders()
  });
  return handleResponse(response);
};

// Consultation APIs
export const bookConsultation = async (consultationData) => {
  const response = await fetch(`${API_BASE_URL}/api/consultations`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(consultationData)
  });
  return handleResponse(response);
};

export const getUserConsultations = async () => {
  const response = await fetch(`${API_BASE_URL}/api/consultations`, {
    method: 'GET',
    headers: getHeaders()
  });
  return handleResponse(response);
};

export const getConsultationById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/consultations/${id}`, {
    method: 'GET',
    headers: getHeaders()
  });
  return handleResponse(response);
};

export const cancelConsultation = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/consultations/${id}/cancel`, {
    method: 'PUT',
    headers: getHeaders()
  });
  return handleResponse(response);
};

// Medical Record APIs
export const createMedicalRecord = async (recordData) => {
  const response = await fetch(`${API_BASE_URL}/api/medical-records`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(recordData)
  });
  return handleResponse(response);
};

export const getUserMedicalRecords = async () => {
  const response = await fetch(`${API_BASE_URL}/api/medical-records`, {
    method: 'GET',
    headers: getHeaders()
  });
  return handleResponse(response);
};

export const getMedicalRecordById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/medical-records/${id}`, {
    method: 'GET',
    headers: getHeaders()
  });
  return handleResponse(response);
};

export const updateMedicalRecord = async (id, recordData) => {
  const response = await fetch(`${API_BASE_URL}/api/medical-records/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(recordData)
  });
  return handleResponse(response);
};

export const deleteMedicalRecord = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/medical-records/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return handleResponse(response);
};

// Health Metrics APIs
export const recordHealthMetrics = async (metricsData) => {
  const response = await fetch(`${API_BASE_URL}/api/health-metrics`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(metricsData)
  });
  return handleResponse(response);
};

export const getUserHealthMetrics = async () => {
  const response = await fetch(`${API_BASE_URL}/api/health-metrics`, {
    method: 'GET',
    headers: getHeaders()
  });
  return handleResponse(response);
};

export const getLatestHealthMetrics = async () => {
  const response = await fetch(`${API_BASE_URL}/api/health-metrics/latest`, {
    method: 'GET',
    headers: getHeaders()
  });
  return handleResponse(response);
};

export const getHealthMetricsByDateRange = async (start, end) => {
  const query = buildQueryString({ start, end });
  const response = await fetch(`${API_BASE_URL}/api/health-metrics/range?${query}`, {
    method: 'GET',
    headers: getHeaders()
  });
  return handleResponse(response);
};
