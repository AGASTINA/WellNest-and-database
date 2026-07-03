const configuredApiUrl = process.env.REACT_APP_API_URL;
const isLocalBrowser =
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

export const API_ORIGIN = (configuredApiUrl || (isLocalBrowser ? 'http://localhost:8081' : '')).replace(/\/$/, '');
export const API_BASE_URL = `${API_ORIGIN}/api`;

export const apiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_ORIGIN}${normalizedPath}`;
};
