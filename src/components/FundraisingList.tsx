import { Box, Pagination, Skeleton } from "@mui/material";
import FundraisingCard from "./common/FundraisingCard";
import { useEffect, useState } from "react";
import { Tag } from "../models/Tag";
import Fundraising from "../models/Fundraising";
import { useUser } from "../contexts/UserContext";
import fundraisingsRepository from "../repository/fundraisingsRepository";
import tagsRepository from "../repository/tagsRepository";
import Search from "./common/Search";
import MultiSelectWithChips from "./common/MultiSelectWithChips";
import PageWrapper from "./common/PageWrapper";

type FundraisingListProps = {
    loader: Function;
    type?: 'USER' | 'ALL'
}

const FundraisingList: React.FC<FundraisingListProps> = ({ loader, type = 'ALL' }) => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedLoading, setSelectedLoading] = useState<boolean>(false);

    const [fundraisings, setFundraisings] = useState<Fundraising[]>([]);
    const [selectedFundraisingId, setSelectedFundraisingId] = useState<string | undefined>();
    const [selectedFundraising, setSelectedFundraising] = useState<Fundraising | undefined>();

    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const { user } = useUser();

    const pageSize = 3;

    const fetchFundraisings = async () => {
        setLoading(true);
        const params = type === 'USER' ? { page, pageSize } : { page: page, pageSize: pageSize, tags: selectedTags, title: searchQuery }
        const fundraisings = await loader(params)
        if (fundraisings && fundraisings?.items) {
            setFundraisings(fundraisings!.items);
            setTotalPages(fundraisings!.totalPages);
        }
        else {
            setFundraisings([]);
            setTotalPages(1);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchFundraisings();
    }, [selectedTags, searchQuery, page]);

    useEffect(() => {
        setPage(1);
    }, [selectedTags, searchQuery]);

    useEffect(() => {
        const fetchData = async () => {
            const tags = await tagsRepository.getTags();
            if (tags) {
                setTags(tags);
            }
        }

        fetchData();
    }, [user]);

    useEffect(() => {
        const fetchData = async () => {
            setSelectedLoading(true);
            if (selectedFundraisingId) {
                const fundraising = await fundraisingsRepository.getFundraising(selectedFundraisingId);
                if (fundraising) {
                    setSelectedFundraising(fundraising.data);
                }
            }
            setSelectedLoading(false);
        }

        fetchData();
    }, [selectedFundraisingId]);

    return (
        <PageWrapper>
            <Box className='home-page-content'>
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
                        <Search onSearch={(query) => setSearchQuery(query)} />
                        <MultiSelectWithChips
                            limitTags={2}
                            width="350px"
                            label="Tags"
                            values={tags.map((tag) => tag.name)}
                            onChange={setSelectedTags} />
                    </Box >
                    <Box className='search-result-container'>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            minWidth: 650,
                            gap: '20px',
                        }}>
                            {
                                loading
                                    ? (Array(pageSize).fill(0).map((_, index) => (
                                        <Skeleton key={index} sx={{ transform: 'scale(1, 0.90)', height: '130px', width: 600 }} />
                                    )))
                                    : (
                                        !loading && fundraisings.length === 0
                                            ? <h3>No fundraisings found</h3>
                                            : (fundraisings.map((fundraising, index) => (
                                                <Box height={'130px'} key={index}>
                                                    <FundraisingCard
                                                        selected={fundraising.id === selectedFundraisingId}
                                                        key={index}
                                                        onClick={(setSelectedFundraisingId)}
                                                        fundraising={fundraising}
                                                        size="small"
                                                        isUser={type === 'USER'}
                                                    />
                                                </Box>
                                            ))))
                            }
                        </div>
                        <Pagination sx={{
                            display: totalPages >= 1 ? 'flex' : 'none',
                            justifyContent: 'center',
                        }} count={totalPages} page={page} onChange={(_, value) => setPage(value)} />
                    </Box>
                </Box>
                <Box className='selected-fundraising-container'>
                    {
                        selectedLoading
                            ? <Skeleton sx={{ height: '100%', width: '100%', transform: 'scale(1, 0.95)' }} />
                            : (
                                selectedFundraising &&
                                <FundraisingCard
                                    fundraising={selectedFundraising}
                                    onDelete={() => {
                                        setSelectedFundraisingId(undefined);
                                        setSelectedFundraising(undefined);
                                        fetchFundraisings();
                                    }}
                                    size="large" />
                            )
                    }
                </Box>
            </Box>
        </PageWrapper>
    );
};

export default FundraisingList;