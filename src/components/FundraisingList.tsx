import { Box, Container, Divider, Paper, Pagination, Skeleton, Typography, useTheme } from "@mui/material";
import FundraisingCard from "./common/FundraisingCard";
import { useState } from "react";
import Search from "./common/Search";
import MultiSelectWithChip from "./common/MultiSelectWithChips";
import PageWrapper from "./common/PageWrapper";
import { useFundraisingSearch } from "../hooks/useFundraisingSearch";
import FilterSection from "./fundraising/FilterSection";

type FundraisingListProps = {
    type?: 'USER' | 'ALL'
}

const FundraisingList: React.FC<FundraisingListProps> = ({ type = 'ALL' }) => {
    const theme = useTheme();
    const pageSize = 6;

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
    } = useFundraisingSearch({ initialSearchQuery: '', pageSize: pageSize });

    return (
        <PageWrapper>
            <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: { xs: 2, sm: 3 }
                }}>
                    <FilterSection
                        onSearchChange={setSearchQuery}
                        onTagsChange={setSelectedTags}
                        allTags={allTags}
                    />

                    <Box>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: { xs: 2, sm: 3 },
                            flexWrap: 'wrap',
                            gap: 2
                        }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    color: theme.palette.text.primary
                                }}
                            >
                                Results
                            </Typography>
                            {!loading && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {fundraisings.length === 0
                                        ? 'No fundraisings found'
                                        : `Showing ${(page - 1) * pageSize + 1}-${(page - 1) * pageSize + fundraisings.length} of ${totalFundraisings} fundraisings`
                                    }
                                </Typography>
                            )}
                        </Box>
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(auto-fill, minmax(300px, 1fr))',
                                md: 'repeat(auto-fill, minmax(350px, 1fr))'
                            },
                            gap: { xs: 2, sm: 3 },
                            mb: { xs: 3, sm: 4 }
                        }}>
                            {loading ? (
                                Array(pageSize).fill(0).map((_, index) => (
                                    <Skeleton
                                        key={index}
                                        variant="rounded"
                                        sx={{
                                            height: 400,
                                            borderRadius: 2
                                        }}
                                    />
                                ))
                            ) : fundraisings.length === 0 ? (
                                <Box
                                    sx={{
                                        gridColumn: '1/-1',
                                        textAlign: 'center',
                                        py: { xs: 6, sm: 8 },
                                        px: 2
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        color="text.secondary"
                                        sx={{ mb: 1 }}
                                    >
                                        No fundraisings found
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Try adjusting your filters or search query
                                    </Typography>
                                </Box>
                            ) : (
                                fundraisings.map((fundraising) => (
                                    <FundraisingCard
                                        key={fundraising.id}
                                        fundraising={fundraising}
                                        isUser={type === 'USER'}
                                    />
                                ))
                            )}
                        </Box>

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
                    </Box>
                </Box>
            </Container>
        </PageWrapper>
    );
};

export default FundraisingList;