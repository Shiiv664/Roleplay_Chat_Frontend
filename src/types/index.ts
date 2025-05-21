export interface Character {
  id: number;
  label: string;
  name: string;
  description?: string;
  avatar_image?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCharacterRequest {
  label: string;
  name: string;
  description?: string;
  avatar_image?: string;
}