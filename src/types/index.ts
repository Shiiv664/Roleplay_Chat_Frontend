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
  avatar_url?: string;    // Full URL returned by backend for display
  created_at: string;
  updated_at: string;
}

export interface CreateUserProfileRequest {
  label: string;
  name: string;
  description?: string;
  avatar_image?: string; // URL for JSON requests, ignored when file is provided
}

export interface FileUploadResponse {
  success: boolean;
  data: {
    url: string;
  };
  error?: any;
}