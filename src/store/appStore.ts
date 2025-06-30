import { create } from 'zustand';
import { AppState, Client, Project, Contract, Payment, Invoice, Maintenance, User } from '../types';
import { API_ENDPOINTS } from '../config/api';

export const useAppStore = create<AppState>((set, get) => ({
  clients: [],
  projects: [],
  contracts: [],
  payments: [],
  invoices: [],
  maintenances: [],
  users: [],
  loading: false,
  error: null,

  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      const [clientsRes, projectsRes, contractsRes, paymentsRes, invoicesRes, maintenancesRes, usersRes] = await Promise.all([
        fetch(API_ENDPOINTS.clients),
        fetch(API_ENDPOINTS.projects),
        fetch(API_ENDPOINTS.contracts),
        fetch(API_ENDPOINTS.payments),
        fetch(API_ENDPOINTS.invoices),
        fetch(API_ENDPOINTS.maintenances),
        fetch(API_ENDPOINTS.users),
      ]);

      const [clients, projects, contracts, payments, invoices, maintenances, users] = await Promise.all([
        clientsRes.json(),
        projectsRes.json(),
        contractsRes.json(),
        paymentsRes.json(),
        invoicesRes.json(),
        maintenancesRes.json(),
        usersRes.json(),
      ]);

      set({ clients, projects, contracts, payments, invoices, maintenances, users, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch data', loading: false });
      console.error('Fetch error:', error);
    }
  },

  // Client operations
  addClient: async (clientData) => {
    try {
      const newClient = {
        ...clientData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(API_ENDPOINTS.clients, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      });

      if (response.ok) {
        const client = await response.json();
        set(state => ({ clients: [...state.clients, client] }));
      }
    } catch (error) {
      set({ error: 'Failed to add client' });
      console.error('Add client error:', error);
    }
  },

  updateClient: async (id, clientData) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.clients}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });

      if (response.ok) {
        const updatedClient = await response.json();
        set(state => ({
          clients: state.clients.map(c => c.id === id ? updatedClient : c)
        }));
      }
    } catch (error) {
      set({ error: 'Failed to update client' });
      console.error('Update client error:', error);
    }
  },

  deleteClient: async (id) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.clients}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        set(state => ({
          clients: state.clients.filter(c => c.id !== id)
        }));
      }
    } catch (error) {
      set({ error: 'Failed to delete client' });
      console.error('Delete client error:', error);
    }
  },

  // Project operations
  addProject: async (projectData) => {
    try {
      const newProject = {
        ...projectData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(API_ENDPOINTS.projects, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });

      if (response.ok) {
        const project = await response.json();
        set(state => ({ projects: [...state.projects, project] }));
      }
    } catch (error) {
      set({ error: 'Failed to add project' });
      console.error('Add project error:', error);
    }
  },

  updateProject: async (id, projectData) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.projects}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        const updatedProject = await response.json();
        set(state => ({
          projects: state.projects.map(p => p.id === id ? updatedProject : p)
        }));
      }
    } catch (error) {
      set({ error: 'Failed to update project' });
      console.error('Update project error:', error);
    }
  },

  deleteProject: async (id) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.projects}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        set(state => ({
          projects: state.projects.filter(p => p.id !== id)
        }));
      }
    } catch (error) {
      set({ error: 'Failed to delete project' });
      console.error('Delete project error:', error);
    }
  },

  // Contract operations
  addContract: async (contractData) => {
    try {
      const newContract = {
        ...contractData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(API_ENDPOINTS.contracts, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContract),
      });

      if (response.ok) {
        const contract = await response.json();
        set(state => ({ contracts: [...state.contracts, contract] }));
      }
    } catch (error) {
      set({ error: 'Failed to add contract' });
      console.error('Add contract error:', error);
    }
  },

  updateContract: async (id, contractData) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.contracts}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contractData),
      });

      if (response.ok) {
        const updatedContract = await response.json();
        set(state => ({
          contracts: state.contracts.map(c => c.id === id ? updatedContract : c)
        }));
      }
    } catch (error) {
      set({ error: 'Failed to update contract' });
      console.error('Update contract error:', error);
    }
  },

  deleteContract: async (id) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.contracts}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        set(state => ({
          contracts: state.contracts.filter(c => c.id !== id)
        }));
      }
    } catch (error) {
      set({ error: 'Failed to delete contract' });
      console.error('Delete contract error:', error);
    }
  },

  // Payment operations
  addPayment: async (paymentData) => {
    try {
      const newPayment = {
        ...paymentData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(API_ENDPOINTS.payments, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPayment),
      });

      if (response.ok) {
        const payment = await response.json();
        set(state => ({ payments: [...state.payments, payment] }));
      }
    } catch (error) {
      set({ error: 'Failed to add payment' });
      console.error('Add payment error:', error);
    }
  },

  updatePayment: async (id, paymentData) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.payments}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        const updatedPayment = await response.json();
        set(state => ({
          payments: state.payments.map(p => p.id === id ? updatedPayment : p)
        }));
      }
    } catch (error) {
      set({ error: 'Failed to update payment' });
      console.error('Update payment error:', error);
    }
  },

  deletePayment: async (id) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.payments}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        set(state => ({
          payments: state.payments.filter(p => p.id !== id)
        }));
      }
    } catch (error) {
      set({ error: 'Failed to delete payment' });
      console.error('Delete payment error:', error);
    }
  },

  // Invoice operations
  addInvoice: async (invoiceData) => {
    try {
      const newInvoice = {
        ...invoiceData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(API_ENDPOINTS.invoices, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInvoice),
      });

      if (response.ok) {
        const invoice = await response.json();
        set(state => ({ invoices: [...state.invoices, invoice] }));
      }
    } catch (error) {
      set({ error: 'Failed to add invoice' });
      console.error('Add invoice error:', error);
    }
  },

  updateInvoice: async (id, invoiceData) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.invoices}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData),
      });

      if (response.ok) {
        const updatedInvoice = await response.json();
        set(state => ({
          invoices: state.invoices.map(i => i.id === id ? updatedInvoice : i)
        }));
      }
    } catch (error) {
      set({ error: 'Failed to update invoice' });
      console.error('Update invoice error:', error);
    }
  },

  deleteInvoice: async (id) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.invoices}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        set(state => ({
          invoices: state.invoices.filter(i => i.id !== id)
        }));
      }
    } catch (error) {
      set({ error: 'Failed to delete invoice' });
      console.error('Delete invoice error:', error);
    }
  },

  // Maintenance operations
  addMaintenance: async (maintenanceData) => {
    try {
      const newMaintenance = {
        ...maintenanceData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(API_ENDPOINTS.maintenances, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMaintenance),
      });

      if (response.ok) {
        const maintenance = await response.json();
        set(state => ({ maintenances: [...state.maintenances, maintenance] }));
      }
    } catch (error) {
      set({ error: 'Failed to add maintenance' });
      console.error('Add maintenance error:', error);
    }
  },

  updateMaintenance: async (id, maintenanceData) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.maintenances}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maintenanceData),
      });

      if (response.ok) {
        const updatedMaintenance = await response.json();
        set(state => ({
          maintenances: state.maintenances.map(m => m.id === id ? updatedMaintenance : m)
        }));
      }
    } catch (error) {
      set({ error: 'Failed to update maintenance' });
      console.error('Update maintenance error:', error);
    }
  },

  deleteMaintenance: async (id) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.maintenances}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        set(state => ({
          maintenances: state.maintenances.filter(m => m.id !== id)
        }));
      }
    } catch (error) {
      set({ error: 'Failed to delete maintenance' });
      console.error('Delete maintenance error:', error);
    }
  },

  // User operations
  addUser: async (userData) => {
    try {
      const newUser = {
        ...userData,
        id: Date.now().toString(),
      };

      const response = await fetch(API_ENDPOINTS.users, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const user = await response.json();
        set(state => ({ users: [...state.users, user] }));
      }
    } catch (error) {
      set({ error: 'Failed to add user' });
      console.error('Add user error:', error);
    }
  },

  updateUser: async (id, userData) => {
    try {
      // Don't update password if it's empty
      const updateData = { ...userData };
      if (!updateData.password) {
        delete updateData.password;
      }

      const response = await fetch(`${API_ENDPOINTS.users}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        set(state => ({
          users: state.users.map(u => u.id === id ? updatedUser : u)
        }));
      }
    } catch (error) {
      set({ error: 'Failed to update user' });
      console.error('Update user error:', error);
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.users}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        set(state => ({
          users: state.users.filter(u => u.id !== id)
        }));
      }
    } catch (error) {
      set({ error: 'Failed to delete user' });
      console.error('Delete user error:', error);
    }
  },
}));