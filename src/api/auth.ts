import axiosClient from './axiosClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserResponse {
  id: number;
  email: string;
  full_name?: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

export const authAPI = {
  register: (data: RegisterRequest) =>
    axiosClient.post<UserResponse>('/auth/register', data),

  login: (data: LoginRequest) =>
    axiosClient.post<AuthResponse>('/auth/login', data),

  refresh: (refreshToken: string) =>
    axiosClient.post<AuthResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    }),

  getMe: () => axiosClient.get<UserResponse>('/auth/me'),
};
