import axios from 'axios';
import type { Character, CreateCharacterRequest } from '../types';

const API_BASE_URL = 'http://127.0.0.1:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const charactersApi = {
  getAll: async (): Promise<Character[]> => {
    const response = await api.get('/api/v1/characters/');
    // The API returns { success, data, meta, error }
    return response.data.data || [];
  },

  create: async (character: CreateCharacterRequest): Promise<Character> => {
    const response = await api.post('/api/v1/characters/', character);
    // Assuming the create endpoint also wraps the data
    return response.data.data || response.data;
  },
};

export default api;