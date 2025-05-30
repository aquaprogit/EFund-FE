import { Box, Pagination, Skeleton } from "@mui/material";
import PageWrapper from "../../../shared/components/PageWrapper";
import Search from "../../../shared/components/Search";
import { useEffect, useState } from "react";
import User from "../models/User";
import { userRepository } from "../api/userRepository";
import UserCard from "../components/UserCard";
import { useUser } from "../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const UsersPage = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [a, setA] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(true);
    const [users, setUsers] = useState<User[]>([]);

    const { user: currentUser, loading: loadingUser } = useUser();

    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const pageSize = 3;
    const navigate = useNavigate();

    const fetchUsers = async () => {
        setLoading(true);
        const params = { page: page, pageSize: pageSize, query: searchQuery }
        const response = await userRepository.getUsers(params)

        if (response.isSuccess && response.data?.items) {
            setUsers(loadingUser ? response.data.items.filter((user: User) => user.id !== currentUser!.id) : response.data.items);
            setTotalPages(response.data.totalPages);
        }
        else {
            setUsers([]);
            setTotalPages(1);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchUsers();
    }, [a]);

    useEffect(() => {
        fetchUsers();
    }, [searchQuery, page]);

    useEffect(() => {
        setPage(1);
        fetchUsers();
    }, []);


    return (
        <PageWrapper>
            {
                (loadingUser || (currentUser && currentUser.isAdmin))
                    ? (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '30px',
                                padding: '30px',
                                width: '100%',
                                height: '100%',
                            }}
                            className='home-page-content'
                        >
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px'
                            }}>
                                <Box sx={
                                    {
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        gap: '25px',
                                        justifyContent: 'space-evenly',
                                    }
                                }>
                                    <Search onSearch={setSearchQuery} />
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '20px'
                                }}>
                                    {
                                        loading
                                            ? (Array(pageSize).fill(0).map((_, index) => (
                                                <Skeleton key={index} sx={{ transform: 'scale(1, 0.90)', height: '150px', width: 450 }} />
                                            )))
                                            : (
                                                !loading && users.length === 0
                                                    ? <h3>No users found</h3>
                                                    : users.map((user) => (
                                                        <UserCard user={user} onAction={() => setA(prev => prev === 'a' ? 'A' : 'a')} />
                                                    ))
                                            )
                                    }
                                    <Pagination sx={{
                                        display: totalPages >= 1 ? 'flex' : 'none',
                                        justifyContent: 'center',
                                    }} count={totalPages} page={page} onChange={(_, value) => setPage(value)} />
                                </Box>
                            </Box>
                        </Box>
                    )
                    : <>{navigate('/')}</>
            }
        </PageWrapper >
    );
}

export default UsersPage;