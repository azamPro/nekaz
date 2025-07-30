// API configuration for different environments
const getApiBaseUrl = () => {
  // Check if we're in production (Vercel deployment)
  if (import.meta.env.VITE_APP_ENV === 'production') {
    return import.meta.env.VITE_API_BASE_URL || 'https://nekaz.vercel.app';
  }
  
  // Development environment - use local JSON server
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