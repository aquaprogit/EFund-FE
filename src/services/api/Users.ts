import API from "./repository/API";

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
    }
}

export default Users;