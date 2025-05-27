import { SearchUsersRequest } from '../../models/api/request/UsersRequest';
import { APIResponseBase } from '../../models/api/response/base/APIResponseBase';
import Paged from "../../models/api/response/base/Paged";
import User from "../../models/user/User";
import API from "./repository/API";

export type UpdateUserInfo = { name: string }
export type AddPassword = {password: string}
export type ChangePassword = {oldPassword: string, newPassword: string}

const Users = {
    async uploadAvatar(file: File): Promise<boolean> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await API.post('/users/avatar', formData);
        return response.success;
    },

    async deleteAvatar(): Promise<boolean> {
        const response = await API.delete('/users/avatar');
        return response.success;
    },
    async updateInfo(requestBody: UpdateUserInfo): Promise<any> {
        const response = await API.put('/users/me', requestBody);
        return response.success;
    },
    async addPassword(requestBody: AddPassword) {
        try {
            return await API.post('/users/add-password', requestBody)
        }
        catch (e) {
            console.error(e)
        }
    },
    async changePassword(requestBody: ChangePassword) {
        try {
            return await API.post('/users/change-password', requestBody)
        }
        catch (e) {
            console.error(e)
        }
    },

    async getUsers(request: SearchUsersRequest): Promise<Paged<User> | undefined> {
        try {
            const response = await API.postPaged<SearchUsersRequest, Paged<User>>('/users/search', request);
            return response.data;
        }
        catch (e) {
            console.error(e)
        }
    },

    async makeAdmin(request: { userId: string }): Promise<boolean> {
        const response = await API.post('/users/make-admin', request);
        return response.success;
    },

    async action(request: { userId: string, action: 'block' | 'unblock' }): Promise<boolean> {
        const response = await API.post('/users/action', request);
        return response.success;
    },

    async inviteAdmin(request: { email: string }): Promise<boolean> {
        const response = await API.post('/users/invite-admin', request);
        return response.success;
    }
}

export default Users;