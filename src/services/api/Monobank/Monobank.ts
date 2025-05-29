import api from "../repository/api";

export const monobankApi = {
    linkToken: async (token: string) => {
        try {
            return await api.post('/monobank/link-token', {}, {
                'token': token
            });
        }
        catch (e) {
            console.error(e)
        }
    },
    getJars: async () => {
        try {
            return await api.get('/monobank/jars')
        }
        catch (e) {
            console.error(e)
        }
    }
}