import API from "./repository/API";

export type UpdateUserInfo = { [key: string]: string }
export type AddPassword = {password: string}

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
    }
}

export default Users;