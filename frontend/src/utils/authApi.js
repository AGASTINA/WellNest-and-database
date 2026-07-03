import { apiUrl, getApiConfigurationError } from './apiConfig';

export const postAuth = async (path, payload) => {
  const configError = getApiConfigurationError();
  if (configError) {
    throw new Error(configError);
  }

  let response;
  try {
    response = await fetch(apiUrl(path), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  } catch {
    throw new Error('Cannot reach the backend API. Make sure the Spring Boot server is running and the backend URL is correct.');
  }

  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Backend returned an invalid response (${response.status}). Check that REACT_APP_API_URL points to the Spring Boot backend, not the Netlify frontend.`);
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};
