// API configuration for different environments
const getApiBaseUrl = () => {
  // Check if we're in production (Vercel deployment)
  if (import.meta.env.VITE_APP_ENV === 'production') {
    return import.meta.env.VITE_API_BASE_URL || 'https://nekaz.vercel.app';
  }
  
  // Development environment
  return 'https://nekaz.vercel.app';
};

export const API_BASE = getApiBaseUrl();

// For production deployment, you'll need to:
// 1. Set up a real backend API (Node.js, .NET, etc.)
// 2. Deploy your backend to a service like Railway, Render, or Heroku
// 3. Update the VITE_API_BASE_URL environment variable in Vercel
// 4. Replace the mock JSON server with real API endpoints

export const API_ENDPOINTS = {
  users: `${API_BASE}/users`,
  clients: `${API_BASE}/clients`,
  projects: `${API_BASE}/projects`,
  contracts: `${API_BASE}/contracts`,
  payments: `${API_BASE}/payments`,
  invoices: `${API_BASE}/invoices`,
  maintenances: `${API_BASE}/maintenances`,
};