import Fundraising from "../models/Fundraising";
import { ApiResponse } from "../models/api/BaseErrorResponse";
import { PagedResponse } from "../models/api/pagination/PagedResponse";
import { SearchFundraisingsRequest } from "../models/api/request/FundraisingsRequests";
import { api } from "../services/api/api";

type AddFundraisingBody = {
    title: string,
    description: string,
    monobankJarId: string,
    tags: Array<string>
}

const fundraisingsRepository = {
    async getFundraisings(request: SearchFundraisingsRequest): Promise<ApiResponse<PagedResponse<Fundraising>> | undefined> {
        // TODO: fix type
        const response = await api.getPaginated<Fundraising>('/fundraisings/search', { page: request.page, pageSize: 1 });

        return response;
    },
    getMyFundraising: async (params: { page: number, pageSize: number }): Promise<ApiResponse<PagedResponse<Fundraising>> | undefined> => {
        try {
            const response = await api.getPaginated<Fundraising>('/fundraisings/', params)
            return response
        }
        catch (e) {
            console.error(e)
        }

    },

    async getFundraising(id: string): Promise<ApiResponse<Fundraising> | undefined> {
        const response = await api.get<Fundraising>(`/fundraisings/${id}`);
        return response;
    },
    async createFundraising(requestBody: AddFundraisingBody) {
        try {
            return await api.post<AddFundraisingBody, Fundraising>('/fundraisings/', requestBody)
        }
        catch (e) {
            console.error()
        }
    },

    async deleteFundraising(id: string) {
        try {
            return await api.delete(`/fundraisings/${id}`)
        }
        catch (e) {
            console.error()
        }
    },

    async uploadImage(id: string, file: File) {
        const formData = new FormData();
        formData.append('file', file);
        return await api.post(`/fundraisings/${id}/avatar`, formData)
    },
    async deleteImage(id: string) {
        return await api.delete(`/fundraisings/${id}/avatar`)
    },
    async updateFundraising(id: string, requestBody: AddFundraisingBody) {
        try {
            return await api.put<AddFundraisingBody, Fundraising>(`/fundraisings/${id}`, requestBody)
        }
        catch (e) {
            console.error()
        }
    }
};

export default fundraisingsRepository;