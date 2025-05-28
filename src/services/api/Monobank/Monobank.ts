import API from "../repository/api";
import { Token } from "./Monobank.types";

class Monobank {
    static async linkToken(token: Token) {
        try {
            return await API.post('/monobank/link-token', {}, { token })
        }
        catch (e) {
            console.error(e)
        }
    }
    static async getJars() {
        try {
            return await API.get('/monobank/jars')
        }
        catch (e) {
            console.error(e)
        }
    }

}

export default Monobank