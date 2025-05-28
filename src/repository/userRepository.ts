import { urls } from '../constants/urls';
import { ApiResponse } from '../models/api/BaseErrorResponse';
import User from '../models/user/User';
import api from '../services/api/api';

export const userRepository = {
    async me(): Promise<ApiResponse<User>> {
        return await api.get<User>(urls.me);
    },

    async changeEmail(newEmail: string): Promise<ApiResponse<void>> {
        return await api.post<{ newEmail: string }, void>(urls.changeEmail, { newEmail });
    }
}; 