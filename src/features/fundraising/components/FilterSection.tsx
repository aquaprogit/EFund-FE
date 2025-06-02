import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    Chip,
    Avatar,
    Divider
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import TagIcon from '@mui/icons-material/Tag';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FilterListIcon from '@mui/icons-material/FilterList';
import Search from "../../../shared/components/Search";
import MultiSelectWithChip from "../../../shared/components/MultiSelectWithChips";
import UserDropDown from "../../users/components/UserDropDown";
import { getStatusOptions, FundraisingStatusLabels } from "../models/FundraisingStatus";

interface FilterSectionProps {
    onSearchChange: (query: string) => void;
    onTagsChange: (tags: string[]) => void;
    allTags: Array<{ name: string }>;
    searchInitialValue: string;
    onUserChange: (userId: string) => void;
    selectedUser: string | undefined;
    onStatusChange: (statuses: number[]) => void;
    selectedStatuses: number[];
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const FilterSection = ({
    onSearchChange,
    onTagsChange,
    allTags,
    searchInitialValue,
    onUserChange,
    selectedUser,
    onStatusChange,
    selectedStatuses
}: FilterSectionProps) => {
    const statusOptions = getStatusOptions();

    const handleStatusChange = (event: any) => {
        const value = event.target.value;
        onStatusChange(typeof value === 'string' ? value.split(',').map(Number) : value);
    };

    return (
        <Card elevation={3} sx={{ borderRadius: 3, mb: 2 }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <FilterListIcon />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Search & Filters
                    </Typography>
                </Box>

                {/* Filter Grid */}
                <Grid container spacing={3}>
                    {/* Search - Full width on mobile */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <SearchIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                Search Campaigns
                            </Typography>
                        </Box>
                        <Search
                            onSearch={onSearchChange}
                            initialValue={searchInitialValue}
                            placeholder="Search by title or description..."
                        />
                    </Grid>



                    {/* Tags Filter - Full width */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <TagIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                Filter by Tags
                            </Typography>
                        </Box>
                        <MultiSelectWithChip
                            limitTags={3}
                            width="100%"
                            label="Select tags"
                            values={allTags.map((tag) => tag.name)}
                            onChange={onTagsChange}
                        />
                    </Grid>


                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                    </Grid>

                    {/* User Filter - Full width on mobile, half on tablet+ */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <PersonIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                Filter by Creator
                            </Typography>
                        </Box>
                        <UserDropDown
                            selectedUser={selectedUser}
                            setSelectedUser={onUserChange}
                        />
                    </Grid>

                    {/* Status Filter - Full width on mobile, half on tablet+ */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <AssignmentIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                Campaign Status
                            </Typography>
                        </Box>
                        <FormControl fullWidth>
                            <InputLabel>Select Status</InputLabel>
                            <Select
                                multiple
                                value={selectedStatuses}
                                onChange={handleStatusChange}
                                input={<OutlinedInput label="Select Status" />}
                                renderValue={(selected) => (
                                    <Box sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 0.5,
                                        maxWidth: '100%',
                                        overflow: 'hidden'
                                    }}>
                                        {selected.map((value) => (
                                            <Chip
                                                key={value}
                                                label={FundraisingStatusLabels[value as keyof typeof FundraisingStatusLabels]}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                                sx={{
                                                    maxWidth: '150px',
                                                    '& .MuiChip-label': {
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }
                                                }}
                                            />
                                        ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                            >
                                {statusOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {/* Helper Text */}
                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                        Use the filters above to find specific campaigns. You can combine multiple filters for more precise results.
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default FilterSection; 