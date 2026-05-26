export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserResponseDTO {
  name: string;
  email: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}
