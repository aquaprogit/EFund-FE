import { Tag } from "../models/Tag";
import { api } from "../services/api/api";

const tagsRepository = {
    async getTags(): Promise<Tag[]> {
        const response = await api.get(`/tags`);
        return response.data as Tag[];
    },
};

export default tagsRepository;