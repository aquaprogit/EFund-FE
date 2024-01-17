import API from './repository/API';
import { ConfirmEmailRequest, RefreshTokenRequest, SignInRequest, SignUpRequest } from '../../models/api/request/AuthRequests';
import { AuthSuccessResponse, SignUpResponse } from '../../models/api/response/AuthResponses';
import { ErrorModel } from '../../models/api/response/base/ErrorModel';
import User from '../../models/user/User';

export type UpdateUserEmail = {newEmail: string}
export type ConfirmChangeEmail = {newEmail: string, code: number}
export type ResendCode = {userId: string}

const Auth = {
    signUp: async (request: SignUpRequest): Promise<SignUpResponse | undefined> => {
        const response = await API.post<SignUpRequest, SignUpResponse>('/auth/sign-up', request);

        if (response.success) {
            return response.data as SignUpResponse;
        }

        return undefined;
    },

    signIn: async (request: SignInRequest): Promise<ErrorModel | undefined> => {
        const response = await API.post<SignInRequest, AuthSuccessResponse>('/auth/sign-in', request);

        if (response.success) {
            const tokens = response.data as AuthSuccessResponse;
            localStorage.setItem('accessToken', tokens.accessToken ?? '');
            localStorage.setItem('refreshToken', tokens.refreshToken ?? '');

            Auth.startSilentRefresh();
            return undefined;
        }

        return response.error;
    },

    confirmEmail: async (request: ConfirmEmailRequest): Promise<ErrorModel | undefined> => {
        const response = await API.post<ConfirmEmailRequest, AuthSuccessResponse>('/auth/confirm-email', request);

        if (response.success) {
            const tokens = response.data as AuthSuccessResponse;
            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);

            Auth.startSilentRefresh();
            return undefined;
        }

        return response.error;
    },

    refreshToken: async (request: RefreshTokenRequest): Promise<ErrorModel | undefined> => {
        const response = await API.post<RefreshTokenRequest, AuthSuccessResponse>('/auth/refresh-token', request);

        if (response.error?.code === 5) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        } 

        if (response.success) {
            const tokens = response.data as AuthSuccessResponse;
            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);

            return undefined;
        }

        return response.error;
    },

    me: async (retry: boolean = true): Promise<User | undefined> => {
        const response = await API.get<User>('/users/me');

        if (response.success) {
            return response.data as User;
        }

        if (response.error?.code === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            return undefined;
        }


        // if (retry) {

        //     const tokens = {
        //         accessToken: localStorage.getItem('accessToken') ?? '',
        //         refreshToken: localStorage.getItem('refreshToken') ?? ''
        //     };

        //     if (!tokens.accessToken || !tokens.refreshToken)
        //         return undefined;

        //     Auth.silentRefresh(tokens);
        //     return Auth.me(false);
        // }

        return undefined;
    },

    startSilentRefresh: () => {
        setInterval(async () => {
            const accessToken = localStorage.getItem('accessToken') ?? '';
            const refreshToken = localStorage.getItem('refreshToken') ?? '';

            const result = await Auth.refreshToken({ accessToken, refreshToken });
            if (!result) {
                console.log('Silent refresh failed');
            }
        }, 600000);
    },

    signInGoogle: async (token: string): Promise<ErrorModel | undefined> => {
        const response = await API.post<{}, AuthSuccessResponse>('/google-auth/sign-in', { }, { 'Authorization-Code': token });

        if (response.success) {
            const tokens = response.data as AuthSuccessResponse;
            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);

            Auth.startSilentRefresh();
            return undefined;
        }

        return response.error;
    },

    signUpGoogle: async (token: string): Promise<ErrorModel | undefined> => {
        const response = await API.post<{}, AuthSuccessResponse>('/google-auth/sign-up', { }, { 'Authorization-Code': token });

        if (response.success) {
            const { accessToken, refreshToken } = response.data as AuthSuccessResponse;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            Auth.startSilentRefresh();
            return undefined;
        }

        return response.error;
    },
    async changeEmail(requestBody: UpdateUserEmail): Promise<any> {
        try {
            return await API.post('/users/change-email', requestBody);
        }
        catch (e) {
            console.error(e);
        }

    },
    async confirmChangeEmail(requestBody: ConfirmChangeEmail) {
        try {
            return await API.post('/users/confirm-change-email', requestBody);
        }
        catch (e) {
            console.error(e);
        }
    },
    async resendConfirmationCode (requestBody: ResendCode) {
        try {
            return await API.post('/auth/resend-confirmation-code', requestBody);
        }
        catch (e) {
            console.error(e);
        }
    }

};

export default Auth;