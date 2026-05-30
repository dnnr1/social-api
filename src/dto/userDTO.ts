export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserResponseDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  bio: string | null;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}
