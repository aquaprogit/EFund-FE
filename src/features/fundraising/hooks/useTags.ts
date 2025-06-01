import { useEffect, useState } from 'react';
import { useToast } from '../../../contexts/ToastContext';
import { Tag } from '../../tags/models/Tag';
import { tagsRepository } from '../../tags/repository/tagsRepository';

export const useTags = () => {
    const [existingTags, setExistingTags] = useState<string[]>([]);
    const { showError } = useToast();

    const fetchTags = async () => {
        try {
            const response = await tagsRepository.getTags();
            if (response?.data) {
                setExistingTags(response.data.map((tag: Tag) => tag.name));
            }
        } catch (error) {
            showError('Unexpected error while fetching tags');
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    return existingTags;
}; 