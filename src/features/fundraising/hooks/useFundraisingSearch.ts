import { useEffect, useState } from 'react';
import { Tag } from '../../tags/models/Tag';
import { tagsRepository } from '../../tags/repository/tagsRepository';
import Fundraising from '../models/Fundraising';
import { fundraisingsRepository } from '../repository/fundraisingsRepository';

interface UseFundraisingSearchProps {
    pageSize?: number;
    initialSearchQuery?: string;
    userId?: string;
}

interface UseFundraisingSearchResult {
    fundraisings: Fundraising[];
    loading: boolean;
    page: number;
    totalPages: number;
    totalFundraisings: number;
    searchQuery: string;
    selectedTags: string[];
    allTags: Tag[];
    setPage: (page: number) => void;
    setSearchQuery: (query: string) => void;
    setSelectedTags: (tags: string[]) => void;
    refreshFundraisings: () => Promise<void>;
}

export const useFundraisingSearch = ({
    pageSize = 6,
    initialSearchQuery = '',
    userId
}: UseFundraisingSearchProps = {}): UseFundraisingSearchResult => {
    const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [fundraisings, setFundraisings] = useState<Fundraising[]>([]);
    const [totalFundraisings, setTotalFundraisings] = useState<number>(0);
    // const statuses = [1, 2, 3, 4, 5, 6];
    // const selectedStatuses = type === 'USER' ? [1, 2, 3] : statuses;

    const fetchFundraisings = async () => {
        setLoading(true);
        try {
            const response = await fundraisingsRepository.getFundraisings(
                {
                    title: searchQuery,
                    tags: selectedTags,
                    statuses: [1],
                    userId: userId ?? undefined
                },
                page,
                pageSize
            );

            if (response?.data) {
                setFundraisings(response.data.items);
                setTotalPages(response.data.totalPages);
                setTotalFundraisings(response.data.totalCount);
            } else {
                setFundraisings([]);
                setTotalPages(1);
                setTotalFundraisings(0);
            }
        } catch (error) {
            setFundraisings([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    const fetchTags = async () => {
        const { data: tags } = await tagsRepository.getTags();
        if (tags) {
            setAllTags(tags);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    useEffect(() => {
        fetchFundraisings();
    }, [selectedTags, searchQuery, page]);

    useEffect(() => {
        setPage(1);
    }, [selectedTags, searchQuery]);

    return {
        fundraisings,
        loading,
        page,
        totalPages,
        searchQuery,
        selectedTags,
        allTags,
        setPage,
        setSearchQuery,
        setSelectedTags,
        refreshFundraisings: fetchFundraisings,
        totalFundraisings
    };
}; 