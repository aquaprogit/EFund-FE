import { BaseErrorResponse } from "../BaseErrorResponse";

export interface ApiResponse<T> {
    isSuccess: boolean;
    data?: T;
    error?: BaseErrorResponse;
} 