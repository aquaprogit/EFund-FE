import { APIRequestBase } from '../../../models/api/request/base/APIRequestBase';
import { PagedRequest } from '../../../models/api/request/base/PagedRequest';
import { ErrorModel } from '../../../models/api/response/base/ErrorModel';
import axios from './axios';

interface APIResponse<T> {
    success: boolean;
    data?: T;
    error?: ErrorModel;
}

export const API = {
    get: async <TResponse>(url: string, params?: any): Promise<APIResponse<TResponse>> => {
        try {
            const response = await axios.get<TResponse>(url, { params });
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data };
        }
    },

    post: async <TRequest extends APIRequestBase, TResponse>(
        url: string,
        data: TRequest,
        headers?: { [key: string]: string }
    ): Promise<APIResponse<TResponse>> => {
        try {
            const response = await axios.post<TResponse>(url, data, { headers });
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data };
        }
    },

    postPaged: async<TRequest extends PagedRequest, TResponse>(
        url: string,
        data: TRequest
    ): Promise<APIResponse<TResponse>> => {
        const pageDate = {
            page: data.page ?? 1,
            pageSize: data.pageSize ?? 10
        }

        const query = new URLSearchParams(pageDate as any).toString();

        try {
            const response = await axios.post<TResponse>(`${url}?${query}`, data);
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data };
        }
    },

    put: async <TRequest extends APIRequestBase, TResponse>(
        url: string,
        data: TRequest
    ): Promise<APIResponse<TResponse>> => {
        try {
            const response = await axios.put<TResponse>(url, data);
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data };
        }
    },

    delete: async <TResponse>(url: string): Promise<APIResponse<TResponse>> => {
        try {
            const response = await axios.delete<TResponse>(url);
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data };
        }
    },
};

export default API;