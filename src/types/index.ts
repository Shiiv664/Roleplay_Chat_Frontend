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
  error?: string | object;
}

export interface ApplicationSettings {
  default_user_profile_id: number | null;
  default_system_prompt_id: number | null;
  default_ai_model_id: number | null;
  default_formatting_rules?: FormattingSettings | null;
}

export interface UpdateSettingsRequest {
  default_user_profile_id?: number | null;
  default_system_prompt_id?: number | null;
  default_ai_model_id?: number | null;
}

export interface ChatSession {
  id: number;
  character_id: number;
  user_profile_id: number | null;
  ai_model_id: number | null;
  system_prompt_id: number | null;
  pre_prompt: string | null;
  pre_prompt_enabled: boolean;
  post_prompt: string | null;
  post_prompt_enabled: boolean;
  message_count: number;
  formatting_settings?: FormattingSettings | null;
  created_at: string;
  updated_at: string;
}

export interface OpenRouterAPIKeyStatus {
  has_api_key: boolean;
  key_length?: number;
}

export interface SetOpenRouterAPIKeyRequest {
  api_key: string;
}

// Chat-related types
export interface Message {
  id: number;
  chat_session_id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface CreateChatSessionRequest {
  character_id: number;
}

export interface SendMessageRequest {
  content: string;
  stream?: boolean;
}

export interface SSEEvent {
  type: 'user_message_saved' | 'content' | 'done' | 'error' | 'cancelled';
  data?: string;
  error?: string;
  reason?: string;
  user_message_id?: number;
  ai_message_id?: number;
}

// Text Formatting types
export interface FormattingRule {
  id: string;
  delimiter: string;
  name: string;
  styles: {
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    textDecoration?: 'none' | 'underline' | 'line-through';
    fontSize?: string;
    color?: string;
    backgroundColor?: string;
    fontFamily?: string;
  };
  enabled: boolean;
}

export interface FormattingSettings {
  enabled: boolean;
  rules: FormattingRule[];
}

export interface UpdateFormattingRequest {
  formatting_settings: FormattingSettings;
}

export interface DefaultFormattingResponse {
  default_formatting_rules: FormattingSettings | string | null;
}

export interface UpdateDefaultFormattingRequest {
  default_formatting_rules: FormattingSettings;
}

export interface UpdateChatSessionRequest {
  user_profile_id?: number | null;
  ai_model_id?: number | null;
  system_prompt_id?: number | null;
  pre_prompt?: string | null;
  pre_prompt_enabled?: boolean;
  post_prompt?: string | null;
  post_prompt_enabled?: boolean;
  formatting_settings?: FormattingSettings | null;
}