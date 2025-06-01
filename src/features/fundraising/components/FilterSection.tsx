import { Box, Paper, Typography, useTheme } from "@mui/material";
import Search from "../../../shared/components/Search";
import MultiSelectWithChip from "../../../shared/components/MultiSelectWithChips";
import { UserDetails } from "../../users/models/UserDetails";
import UserDropDown from "../../users/components/UserDropDown";

interface FilterSectionProps {
    onSearchChange: (query: string) => void;
    onTagsChange: (tags: string[]) => void;
    allTags: Array<{ name: string }>;
    searchInitialValue: string;

    onUserChange: (userId: string) => void;
    selectedUser: string | undefined;
}

const FilterSection = ({
    onSearchChange,
    onTagsChange,
    allTags,
    searchInitialValue,
    onUserChange,
    selectedUser
}: FilterSectionProps) => {
    const theme = useTheme();

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    mb: { xs: 2, sm: 3 },
                    fontWeight: 600,
                    color: theme.palette.text.primary
                }}
            >
                Filters
            </Typography>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: { xs: 'stretch', sm: 'center' },
            }}>
                <Box sx={{ flex: 1 }}>
                    <Search onSearch={onSearchChange} sx={{ maxWidth: '300px' }} initialValue={searchInitialValue} />
                </Box>
                <Box>
                    <UserDropDown
                        selectedUser={selectedUser}
                        setSelectedUser={onUserChange}
                    />
                </Box>
                <Box sx={{ width: { xs: '100%', sm: '350px' } }}>
                    <MultiSelectWithChip
                        limitTags={2}
                        width="100%"
                        label="Tags"
                        values={allTags.map((tag) => tag.name)}
                        onChange={onTagsChange}
                    />
                </Box>
            </Box>
        </Paper>
    );
};

export default FilterSection; 