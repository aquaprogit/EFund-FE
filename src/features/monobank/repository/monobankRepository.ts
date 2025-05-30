import api from "../../../shared/api/api";
import { ApiResponse } from "../../../shared/models/api/pagination/ApiResponse";
import { urls } from "./urls";

export const monobankRepository = {
    linkToken: async (token: string): Promise<ApiResponse<{}>> => {
        return await api.post(urls.linkToken, {}, {
            'token': token
        });
    },
    getJars: async (): Promise<ApiResponse<{}>> => {
        return await api.get(urls.jars)
    }
}