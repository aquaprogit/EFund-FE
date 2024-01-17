import API from "../repository/API";
import {Token} from "./Monobank.types";

class Monobank {
    static async linkToken(token: Token) {
        try {
            return await API.post('/monobank/link-token',{}, {token})

        }
        catch (e) {
            console.error(e)
        }
    }

}

export default Monobank