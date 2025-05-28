import { Tag } from "../../models/Tag";
import API from "./repository/api";

const Tags = {
    async getTags(): Promise<Tag[]> {
        const response = await API.get(`/tags`);
        return response.data as Tag[];
    },
};

export default Tags;