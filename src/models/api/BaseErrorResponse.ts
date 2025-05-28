export interface BaseErrorResponse {
    message: string;
    statusCode: number;
}

export interface ApiResponse<T> {
    isSuccess: boolean;
    data?: T;
    error?: BaseErrorResponse;
} 