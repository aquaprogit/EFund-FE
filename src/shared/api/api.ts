import { isAxiosError } from 'axios';
import { BaseErrorResponse } from '../models/api/BaseErrorResponse';
import { ApiResponse } from '../models/api/pagination/ApiResponse';
import { PagedResponse } from '../models/api/pagination/PagedResponse';
import { PaginatedRequest } from '../models/api/pagination/PaginatedRequest';
import axios from './axios';

export const api = {
    get: async <TResponse>(url: string, params?: any): Promise<ApiResponse<TResponse>> => {
        try {
            const response = await axios.get<TResponse>(url, { params: params });
            return { isSuccess: true, data: response.data };
        }
        catch (error) {
            return handleError(error);
        }
    },

    getPaginated: async <TResponse>(url: string, pagination: PaginatedRequest<any>, params?: any): Promise<ApiResponse<PagedResponse<TResponse>>> => {
        try {
            const response = await axios.get<PagedResponse<TResponse>>(url, {
                params: {
                    ...pagination,
                    ...params
                }
            });
            return { isSuccess: true, data: response.data };
        }
        catch (error) {
            return handleError(error);
        }
    },

    postPaginated: async <TRequest, TResponse>(url: string, request: PaginatedRequest<TRequest>): Promise<ApiResponse<PagedResponse<TResponse>>> => {
        try {
            const queryParams = new URLSearchParams({ page: request.page.toString(), pageSize: request.pageSize.toString() });

            const response = await axios.post<PagedResponse<TResponse>>(url + '?' + queryParams.toString(), request.request);
            return { isSuccess: true, data: response.data };
        }
        catch (error) {
            return handleError(error);
        }
    },


    post: async <TRequest, TResponse>(url: string, request: TRequest, headers?: { [key: string]: string }): Promise<ApiResponse<TResponse>> => {
        try {
            const response = await axios.post<TResponse>(url, request, {
                headers: headers
            });
            return { isSuccess: true, data: response.data };
        }
        catch (error) {
            return handleError(error);
        }
    },

    put: async <TRequest, TResponse>(url: string, request: TRequest): Promise<ApiResponse<TResponse>> => {
        try {
            const response = await axios.put<TResponse>(url, request);
            return { isSuccess: true, data: response.data };
        }
        catch (error) {
            return handleError(error);
        }
    },

    delete: async (url: string): Promise<ApiResponse<{}>> => {
        try {
            await axios.delete(url);
            return { isSuccess: true };
        }
        catch (error) {
            return handleError(error);
        }
    }
};

const handleError = <T>(error: any): ApiResponse<T> => {
    if (isAxiosError(error)) {
        return { isSuccess: false, error: error.response?.data as BaseErrorResponse };
    }

    console.error(error);
    throw error;
};

export default api; 