// FRONTEND/src/lib/api.js
import axios from 'axios';

// Configuration de base pour axios
const API_BASE_URL = 'http://localhost:5000/api';

// Créer une instance axios avec configuration de base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter automatiquement le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Service pour les patients
export const patientService = {
  // Récupérer un patient par email
  getPatientByEmail: async (email) => {
    try {
      const response = await api.get(`/patients/by-email/${encodeURIComponent(email)}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du patient par email:', error);
      throw error;
    }
  },

  // Récupérer un patient par ID
  getPatientById: async (id) => {
    try {
      const response = await api.get(`/patients/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du patient par ID:', error);
      throw error;
    }
  },

  // Créer un nouveau patient
  createPatient: async (patientData) => {
    try {
      const response = await api.post('/patients', patientData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du patient:', error);
      throw error;
    }
  },

  // Mettre à jour un patient
  updatePatient: async (id, patientData) => {
    try {
      const response = await api.put(`/patients/${id}`, patientData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du patient:', error);
      throw error;
    }
  },
};

// Service pour l'authentification
export const authService = {
  // Récupérer les informations de l'utilisateur connecté
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
      throw error;
    }
  },
};

export default api;