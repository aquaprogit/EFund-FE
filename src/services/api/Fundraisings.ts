import Fundraising from "../../models/Fundraising";
import { SearchFundraisingsRequest } from "../../models/api/request/FundraisingsRequests";
import Paged from "../../models/api/response/base/Paged";
import API from "./repository/API";
type AddFundraisingBody = {
    title: string,
    description: string,
    monobankJarId: string,
    tags: Array<string>
}

const Fundraisings = {
    async getFundraisings(request: SearchFundraisingsRequest): Promise<Paged<Fundraising> | undefined> {
        const response = await API.postPaged<SearchFundraisingsRequest, Paged<Fundraising>>('/fundraisings/search', request);

        return response.data;
    },

    async getFundraising(id: string): Promise<Fundraising | undefined> {
        const response = await API.get<Fundraising>(`/fundraisings/${id}`);

        return response.data;
    },
    async createFundraising(requestBody: AddFundraisingBody) {
        try {
            return await API.post<AddFundraisingBody, Fundraising>('/fundraisings/', requestBody)
        }
        catch (e) {
            console.error()
        }
    },
    async uploadImage(id: string, file: File) {
        const formData = new FormData();
        formData.append('file', file);
        return await API.post(`/fundraisings/${id}/avatar`, formData)
    },
    async deleteImage(id: string) {
        return await API.delete(`/fundraisings/${id}/avatar`)
    }
};

export default Fundraisings;