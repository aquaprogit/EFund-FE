import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ConfirmEmailRequest } from '../models/requests/ConfirmEmailRequest';
import { SignInRequest } from '../models/requests/SignInRequest';
import { SignUpRequest } from '../models/requests/SignUpRequest';
import { authRepository } from '../repository/authRepository';

type AuthState = {
    isAuth: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    userId: string | null;
    signIn: (request: SignInRequest) => Promise<boolean>;
    signUp: (request: SignUpRequest) => Promise<string | null>;
    confirmEmail: (request: ConfirmEmailRequest) => Promise<boolean>;
    signOut: () => void;
    refresh: (accessToken: string, refreshToken: string) => Promise<void>;
    googleSignIn: (token: string) => Promise<void>;
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            isAuth: false,
            accessToken: null,
            refreshToken: null,
            userId: null,
            signIn: async (request: SignInRequest) => {
                const response = await authRepository.signIn(request);

                if (response.isSuccess && response.data?.accessToken) {
                    set({
                        isAuth: true,
                        accessToken: response.data.accessToken,
                        refreshToken: response.data.refreshToken
                    });
                    return true;
                }
                return false;
            },
            signOut: () => {
                set({
                    isAuth: false,
                    accessToken: null,
                    refreshToken: null,
                    userId: null
                });
            },
            signUp: async (request: SignUpRequest) => {
                const response = await authRepository.signUp(request);

                if (response.isSuccess && response.data?.userId) {
                    set({
                        userId: response.data.userId
                    });
                    return response.data.userId;
                }
                return null;
            },
            confirmEmail: async (request: ConfirmEmailRequest) => {
                const response = await authRepository.confirmEmail(request);

                if (response.isSuccess && response.data?.accessToken) {
                    set({
                        accessToken: response.data.accessToken,
                        refreshToken: response.data.refreshToken,
                        isAuth: true
                    });
                    return true;
                }
                return false;
            },
            refresh: async (accessToken: string, refreshToken: string) => {
                const response = await authRepository.refresh(accessToken, refreshToken);

                if (response.isSuccess && response.data) {
                    set({
                        accessToken: response.data.accessToken,
                        refreshToken: response.data.refreshToken
                    });
                }
            },
            googleSignIn: async (token: string) => {
                const response = await authRepository.googleSignIn(token);

                if (response.isSuccess && response.data) {
                    set({
                        isAuth: true,
                        accessToken: response.data.accessToken,
                        refreshToken: response.data.refreshToken
                    });
                }
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
); 