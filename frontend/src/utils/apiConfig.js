const configuredApiUrl = process.env.REACT_APP_API_URL;
const normalizedApiUrl = configuredApiUrl
  ? (/^https?:\/\//i.test(configuredApiUrl) ? configuredApiUrl : `https://${configuredApiUrl}`)
  : '';
const isLocalBrowser =
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);
const isFileOrTest =
  typeof window === 'undefined' ||
  window.location.protocol === 'file:' ||
  window.location.hostname === '';

export const API_ORIGIN = (normalizedApiUrl || (isLocalBrowser || isFileOrTest ? 'http://localhost:8081' : '')).replace(/\/$/, '');
export const API_BASE_URL = `${API_ORIGIN}/api`;

export const apiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_ORIGIN}${normalizedPath}`;
};

export const getApiConfigurationError = () => {
  if (API_ORIGIN) return '';
  return 'Backend URL is not configured. Set REACT_APP_API_URL to your deployed Spring Boot backend URL and redeploy.';
};
