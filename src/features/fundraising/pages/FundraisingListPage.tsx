import { Container, Box, Paper, Pagination, useTheme, Theme } from "@mui/material"
import PageWrapper from "../../../shared/components/PageWrapper"
import FilterSection from "../components/FilterSection"
import { useFundraisingSearch } from "../hooks/useFundraisingSearch"
import FundraisingList from "../components/FundraisingList"
import { useParams, useSearchParams } from "react-router-dom"

const PaginationPaper = ({ totalPages, page, setPage, theme }: { totalPages: number, page: number, setPage: (page: number) => void, theme: Theme }) => {
    return (
        <>
            {totalPages > 1 && (
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, sm: 3 },
                        borderRadius: 2,
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(_, value) => setPage(value)}
                            color="primary"
                            size="large"
                            showFirstButton
                            showLastButton
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    borderRadius: 1,
                                }
                            }}
                        />
                    </Box>
                </Paper>
            )}
        </>
    )
}


const FundraisingListPage = () => {
    const theme = useTheme();
    const pageSize = 6;

    const [searchParams] = useSearchParams();
    const userId = searchParams.get('userId');
    const searchQuery = searchParams.get('keyword') ?? '';

    console.log(searchQuery);

    const {
        fundraisings,
        loading,
        page,
        totalPages,
        allTags,
        setPage,
        setSearchQuery,
        setSelectedTags,
        totalFundraisings
    } = useFundraisingSearch({ initialSearchQuery: searchQuery, pageSize: pageSize, userId: userId ?? undefined });

    return (
        <PageWrapper searchAvailable={false}>
            <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: { xs: 2, sm: 3 }
                }}>
                    <FilterSection
                        searchInitialValue={searchQuery}
                        onSearchChange={setSearchQuery}
                        onTagsChange={setSelectedTags}
                        allTags={allTags}
                    />

                    <Box>
                        <FundraisingList
                            pageSize={pageSize}
                            theme={theme}
                            page={page}
                            totalFundraisings={totalFundraisings}
                            fundraisings={fundraisings}
                            loading={loading}
                        />
                        <PaginationPaper
                            totalPages={totalPages}
                            page={page}
                            setPage={setPage}
                            theme={theme}
                        />
                    </Box>
                </Box>
            </Container>
        </PageWrapper>
    )
}

export default FundraisingListPage;