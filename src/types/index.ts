export interface Character {
  id: number;
  label: string;
  name: string;
  description?: string;
  avatar_image?: string;  // Relative path returned by backend
  avatar_url?: string;    // Full URL returned by backend for display
  created_at: string;
  updated_at: string;
}

export interface CreateCharacterRequest {
  label: string;
  name: string;
  description?: string;
  avatar_image?: string; // URL for JSON requests, ignored when file is provided
}

export interface UserProfile {
  id: number;
  label: string;
  name: string;
  description?: string;
  avatar_image?: string;  // Relative path returned by backend
  avatar_url?: string;    // URL path returned by backend (may need API_BASE_URL prepended)
  created_at: string;
  updated_at: string;
}

export interface CreateUserProfileRequest {
  label: string;
  name: string;
  description?: string;
  avatar_image?: string; // URL for JSON requests, ignored when file is provided
}

export interface SystemPrompt {
  id: number;
  label: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSystemPromptRequest {
  label: string;
  content: string;
}

export interface AIModel {
  id: number;
  label: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAIModelRequest {
  label: string;
  description?: string;
}

export interface FileUploadResponse {
  success: boolean;
  data: {
    url: string;
  };
  error?: any;
}

export interface ApplicationSettings {
  default_user_profile_id: number | null;
  default_system_prompt_id: number | null;
  default_ai_model_id: number | null;
}

export interface UpdateSettingsRequest {
  default_user_profile_id?: number | null;
  default_system_prompt_id?: number | null;
  default_ai_model_id?: number | null;
}