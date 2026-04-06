const API_URL = 'http://localhost:8081/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
};

// Doctor API
export const getDoctors = async () => {
  return request('/doctors');
};

export const getDoctorById = async (id) => {
  return request(`/doctors/${id}`);
};

export const searchDoctors = async (keyword) => {
  const query = new URLSearchParams({ keyword }).toString();
  return request(`/doctors/search?${query}`);
};

export const getNearbyDoctors = async (latitude, longitude, radius = 10) => {
  const query = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    radius: String(radius)
  }).toString();
  return request(`/doctors/nearby?${query}`);
};

// Hospital API
export const getHospitals = async () => {
  return request('/hospitals');
};

export const getNearbyHospitals = async (latitude, longitude, radius = 10) => {
  const query = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    radius: String(radius)
  }).toString();
  return request(`/hospitals/nearby?${query}`);
};

export const getNearbyEmergencyHospitals = async (latitude, longitude, radius = 10) => {
  const query = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    radius: String(radius)
  }).toString();
  return request(`/hospitals/nearby/emergency?${query}`);
};

// Consultation API
export const bookConsultation = async (consultationData) => {
  return request('/consultations', {
    method: 'POST',
    body: JSON.stringify(consultationData)
  });
};

export const getConsultations = async () => {
  return request('/consultations');
};

export const cancelConsultation = async (id) => {
  return request(`/consultations/${id}/cancel`, {
    method: 'PUT',
    body: JSON.stringify({})
  });
};

// Medical Records API
export const getMedicalRecords = async () => {
  return request('/medical-records');
};

export const createMedicalRecord = async (recordData) => {
  return request('/medical-records', {
    method: 'POST',
    body: JSON.stringify(recordData)
  });
};

export const updateMedicalRecord = async (id, recordData) => {
  return request(`/medical-records/${id}`, {
    method: 'PUT',
    body: JSON.stringify(recordData)
  });
};

export const deleteMedicalRecord = async (id) => {
  return request(`/medical-records/${id}`, {
    method: 'DELETE'
  });
};

// Health Metrics API
export const getHealthMetrics = async () => {
  return request('/health-metrics');
};

export const getLatestHealthMetrics = async () => {
  return request('/health-metrics/latest');
};

export const recordHealthMetrics = async (metricsData) => {
  return request('/health-metrics', {
    method: 'POST',
    body: JSON.stringify(metricsData)
  });
};
