import { useEffect, useState } from 'react';
import { Tag } from '../../tags/models/Tag';
import { tagsRepository } from '../../tags/repository/tagsRepository';
import { userRepository } from '../../users/api/userRepository';
import { UserDetails } from '../../users/models/UserDetails';
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
    selectedStatuses: number[];
    allTags: Tag[];
    setPage: (page: number) => void;
    setSearchQuery: (query: string) => void;
    setSelectedTags: (tags: string[]) => void;
    setSelectedStatuses: (statuses: number[]) => void;
    refreshFundraisings: () => Promise<void>;
    allUsers: UserDetails[];
    selectedUser: string | undefined;
    setSelectedUser: (userId: string) => void;
}

export const useFundraisingSearch = ({
    pageSize = 6,
    initialSearchQuery = '',
    userId
}: UseFundraisingSearchProps = {}): UseFundraisingSearchResult => {
    const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<number[]>([1]); // Default to Open status
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [fundraisings, setFundraisings] = useState<Fundraising[]>([]);
    const [totalFundraisings, setTotalFundraisings] = useState<number>(0);
    const [allUsers, setAllUsers] = useState<UserDetails[]>([]);
    const [selectedUser, setSelectedUser] = useState<string | undefined>(userId);

    // statuses

    const fetchFundraisings = async () => {
        setLoading(true);
        try {
            const response = await fundraisingsRepository.getFundraisings(
                {
                    title: searchQuery,
                    tags: selectedTags,
                    statuses: selectedStatuses,
                    userId: selectedUser ?? undefined
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

    const fetchUsers = async () => {
        const { data: users } = await userRepository.getUsersMinimized(searchQuery);
        if (users) {
            setAllUsers(users);
        }
    };

    useEffect(() => {
        fetchTags();
        fetchUsers();
    }, []);

    useEffect(() => {
        fetchFundraisings();
    }, [selectedTags, searchQuery, selectedStatuses, selectedUser, page]);

    useEffect(() => {
        setPage(1);
    }, [selectedTags, searchQuery, selectedStatuses, selectedUser]);

    return {
        fundraisings,
        loading,
        page,
        totalPages,
        searchQuery,
        selectedTags,
        selectedStatuses,
        allTags,
        setPage,
        setSearchQuery,
        setSelectedTags,
        setSelectedStatuses,
        refreshFundraisings: fetchFundraisings,
        totalFundraisings,
        allUsers,
        selectedUser,
        setSelectedUser
    };
}; 