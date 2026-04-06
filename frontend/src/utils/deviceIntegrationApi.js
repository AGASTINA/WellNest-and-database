const API_URL = 'http://localhost:8081/api/device-integrations';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

const request = async (path = '', options = {}) => {
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

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  return text || null;
};

export const listConnectedDevices = async () => {
  return request('');
};

export const connectDevice = async (payload) => {
  return request('/connect', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};

export const syncDevice = async (deviceId) => {
  return request(`/${deviceId}/sync`, {
    method: 'POST',
    body: JSON.stringify({})
  });
};

export const disconnectDevice = async (deviceId) => {
  return request(`/${deviceId}`, {
    method: 'DELETE'
  });
};
