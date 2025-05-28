import { urls } from '../constants/urls';
import { ApiResponse } from '../models/api/BaseErrorResponse';
import { ConfirmEmailRequest } from '../models/requests/ConfirmEmailRequest';
import { SignInRequest } from '../models/requests/SignInRequest';
import { SignUpRequest } from '../models/requests/SignUpRequest';
import api from '../services/api/api';

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}

interface SignUpResponse {
    userId: string;
}

export const authRepository = {
    async signIn(request: SignInRequest): Promise<ApiResponse<AuthResponse>> {
        return await api.post<SignInRequest, AuthResponse>(urls.signIn, request);
    },

    async signUp(request: SignUpRequest): Promise<ApiResponse<SignUpResponse>> {
        return await api.post<SignUpRequest, SignUpResponse>(urls.signUp, request);
    },

    async confirmEmail(request: ConfirmEmailRequest): Promise<ApiResponse<AuthResponse>> {
        return await api.post<ConfirmEmailRequest, AuthResponse>(urls.confirmEmail, request);
    },

    async refresh(accessToken: string, refreshToken: string): Promise<ApiResponse<AuthResponse>> {
        return await api.post<{ accessToken: string; refreshToken: string }, AuthResponse>(
            urls.refresh,
            { accessToken, refreshToken }
        );
    },

    async googleSignIn(token: string): Promise<ApiResponse<AuthResponse>> {
        return await api.post<{ token: string }, AuthResponse>(urls.googleAuth, { token });
    }
}; 