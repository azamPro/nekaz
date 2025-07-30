// API configuration for different environments
const getApiBaseUrl = () => {
  // Always use local JSON server in development
  return 'http://localhost:3001';
};

export const API_BASE = getApiBaseUrl();

export const API_ENDPOINTS = {
  users: `${API_BASE}/users`,
  clients: `${API_BASE}/clients`,
  projects: `${API_BASE}/projects`,
  contracts: `${API_BASE}/contracts`,
  payments: `${API_BASE}/payments`,
  invoices: `${API_BASE}/invoices`,
  maintenances: `${API_BASE}/maintenances`,
};