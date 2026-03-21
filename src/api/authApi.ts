// =============================================================
//  src/api/authApi.ts
//
//  CONCEPT: API layer — separating concerns
//  All auth-related API calls live here.
//  Components and context never call axios directly —
//  they always go through these functions.
//  This means if the backend URL or response shape changes,
//  we fix it in ONE place, not everywhere.
// =============================================================

import axiosInstance from './axiosInstance';

// ── Types ────────────────────────────────────────────────────
export interface SignupPayload {
    name: string;
    email: string;
    password: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

// Shape of what backend returns inside ApiResponse.data
export interface AuthResponse {
    token: string;
    name: string;
    email: string;
}

// ── API calls ────────────────────────────────────────────────
// CONCEPT: response.data.data
// Backend wraps everything in ApiResponse<T>:
// { data: { token, name, email }, error: null, timestamp: ... }
// So response.data = ApiResponse wrapper
//    response.data.data = the actual AuthResponseDto

export const signupApi = async (payload: SignupPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/api/auth/signup', payload);
    return response.data.data;
};

export const loginApi = async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/api/auth/login', payload);
    return response.data.data;
};