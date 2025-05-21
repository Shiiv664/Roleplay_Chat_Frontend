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

  create: async (character: CreateCharacterRequest, avatarFile?: File): Promise<Character> => {
    if (avatarFile) {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('label', character.label);
      formData.append('name', character.name);
      if (character.description) {
        formData.append('description', character.description);
      }
      formData.append('avatar_image', avatarFile);

      // Send as multipart/form-data
      const response = await api.post('/api/v1/characters/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data || response.data;
    } else {
      // Send as JSON (existing behavior)
      const response = await api.post('/api/v1/characters/', character);
      return response.data.data || response.data;
    }
  },
};

export default api;