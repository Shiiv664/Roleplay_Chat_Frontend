import axios from 'axios';
import type { 
  Character, 
  CreateCharacterRequest, 
  UserProfile, 
  CreateUserProfileRequest,
  SystemPrompt,
  CreateSystemPromptRequest,
  AIModel,
  CreateAIModelRequest,
  ApplicationSettings,
  UpdateSettingsRequest,
  ChatSession,
  OpenRouterAPIKeyStatus,
  SetOpenRouterAPIKeyRequest,
  CreateChatSessionRequest,
  Message,
  SSEEvent
} from '../types';

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

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/v1/characters/${id}`);
  },

  getById: async (id: number): Promise<Character> => {
    const response = await api.get(`/api/v1/characters/${id}`);
    return response.data.data || response.data;
  },

  update: async (id: number, character: CreateCharacterRequest, avatarFile?: File): Promise<Character> => {
    if (avatarFile) {
      const formData = new FormData();
      formData.append('label', character.label);
      formData.append('name', character.name);
      if (character.description) {
        formData.append('description', character.description);
      }
      formData.append('avatar_image', avatarFile);

      const response = await api.put(`/api/v1/characters/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data || response.data;
    } else {
      const response = await api.put(`/api/v1/characters/${id}`, character);
      return response.data.data || response.data;
    }
  },

  getChats: async (id: number): Promise<ChatSession[]> => {
    const response = await api.get(`/api/v1/chat-sessions/character/${id}`);
    return response.data.data || [];
  },
};

export const userProfilesApi = {
  getAll: async (): Promise<UserProfile[]> => {
    const response = await api.get('/api/v1/user-profiles/');
    // The API returns { success, data, meta, error }
    return response.data.data || [];
  },

  create: async (userProfile: CreateUserProfileRequest, avatarFile?: File): Promise<UserProfile> => {
    if (avatarFile) {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('label', userProfile.label);
      formData.append('name', userProfile.name);
      if (userProfile.description) {
        formData.append('description', userProfile.description);
      }
      formData.append('avatar_image', avatarFile);

      // Send as multipart/form-data
      const response = await api.post('/api/v1/user-profiles/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data || response.data;
    } else {
      // Send as JSON
      const response = await api.post('/api/v1/user-profiles/', userProfile);
      return response.data.data || response.data;
    }
  },

  getDefault: async (): Promise<UserProfile> => {
    const response = await api.get('/api/v1/user-profiles/default');
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/v1/user-profiles/${id}`);
  },
};

export const systemPromptsApi = {
  getAll: async (): Promise<SystemPrompt[]> => {
    const response = await api.get('/api/v1/system-prompts/');
    return response.data.data || [];
  },

  create: async (systemPrompt: CreateSystemPromptRequest): Promise<SystemPrompt> => {
    const response = await api.post('/api/v1/system-prompts/', systemPrompt);
    return response.data.data || response.data;
  },

  getDefault: async (): Promise<SystemPrompt> => {
    const response = await api.get('/api/v1/system-prompts/default');
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/v1/system-prompts/${id}`);
  },
};

export const aiModelsApi = {
  getAll: async (): Promise<AIModel[]> => {
    const response = await api.get('/api/v1/ai-models/');
    return response.data.data || [];
  },

  create: async (aiModel: CreateAIModelRequest): Promise<AIModel> => {
    const response = await api.post('/api/v1/ai-models/', aiModel);
    return response.data.data || response.data;
  },

  getDefault: async (): Promise<AIModel> => {
    const response = await api.get('/api/v1/ai-models/default');
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/v1/ai-models/${id}`);
  },
};

export const settingsApi = {
  get: async (): Promise<ApplicationSettings> => {
    const response = await api.get('/api/v1/settings/');
    return response.data.data || response.data;
  },

  update: async (settings: UpdateSettingsRequest): Promise<ApplicationSettings> => {
    const response = await api.put('/api/v1/settings/', settings);
    return response.data.data || response.data;
  },

  getOpenRouterAPIKeyStatus: async (): Promise<OpenRouterAPIKeyStatus> => {
    const response = await api.get('/api/v1/settings/openrouter-api-key');
    return response.data.data || response.data;
  },

  setOpenRouterAPIKey: async (request: SetOpenRouterAPIKeyRequest): Promise<void> => {
    await api.put('/api/v1/settings/openrouter-api-key', request);
  },

  clearOpenRouterAPIKey: async (): Promise<void> => {
    await api.delete('/api/v1/settings/openrouter-api-key');
  },
};

export const chatApi = {
  createChatSession: async (request: CreateChatSessionRequest): Promise<ChatSession> => {
    const response = await api.post('/api/v1/chat-sessions/', request);
    return response.data.data || response.data;
  },

  getChatSession: async (chatSessionId: number): Promise<any> => {
    const response = await api.get(`/api/v1/chat-sessions/${chatSessionId}`);
    return response.data.data || response.data;
  },

  getMessages: async (chatSessionId: number, page = 1, perPage = 50): Promise<{ items: Message[]; pagination: any }> => {
    const response = await api.get(`/api/v1/messages/chat-sessions/${chatSessionId}?page=${page}&per_page=${perPage}`);
    return response.data.data || response.data;
  },

  getLatestMessages: async (chatSessionId: number, count = 10): Promise<Message[]> => {
    const response = await api.get(`/api/v1/messages/chat-sessions/${chatSessionId}/latest?count=${count}`);
    return response.data.data || [];
  },

  sendMessage: async function* (chatSessionId: number, content: string, stream = true): AsyncGenerator<SSEEvent> {
    const response = await fetch(`${API_BASE_URL}/api/v1/messages/chat-sessions/${chatSessionId}/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, stream }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send message');
    }

    if (stream && response.headers.get('content-type')?.includes('text/event-stream')) {
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');

          // Keep incomplete line in buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ') && line.length > 6) {
              try {
                const eventData = line.slice(6).trim();
                if (eventData) {
                  const event = JSON.parse(eventData);
                  yield event;
                  
                  // If we get done or error, we can break
                  if (event.type === 'done' || event.type === 'error' || event.type === 'cancelled') {
                    return;
                  }
                }
              } catch (e) {
                console.error('Failed to parse SSE event:', e, 'Line:', line);
              }
            }
          }
        }
      } catch (error) {
        console.error('Stream reading error:', error);
        yield { type: 'error', error: 'Stream connection interrupted' };
      } finally {
        try {
          reader.releaseLock();
        } catch (e) {
          // Reader might already be released
        }
      }
    } else {
      // Non-streaming response
      const data = await response.json();
      yield { type: 'content', data: data.content };
      yield { type: 'done' };
    }
  },

  cancelMessage: async (chatSessionId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/messages/chat-sessions/${chatSessionId}/cancel-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cancel request failed:', response.status, errorText);
      throw new Error(`Failed to cancel message: ${response.status}`);
    }
  },
};

export default api;