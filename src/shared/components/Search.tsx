import React, { useEffect, useState } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { Box, InputAdornment, useTheme } from '@mui/material';

interface SearchProps extends Omit<TextFieldProps, 'onChange'> {
    onSearch: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch, InputProps, sx, ...props }) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const theme = useTheme();

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, onSearch]);

    return (
        <TextField
            {...props}
            fullWidth
            variant="standard"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
                ...InputProps,
                endAdornment: (
                    <InputAdornment position="end">
                        <SearchIcon
                            sx={{
                                color: 'text.secondary',
                                fontSize: 20
                            }}
                        />
                    </InputAdornment>
                ),
                sx: {
                    '&:before': {
                        borderColor: theme.palette.divider,
                    },
                    '&:hover:not(.Mui-disabled):before': {
                        borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused:after': {
                        borderColor: theme.palette.primary.main,
                    },
                    ...InputProps?.sx
                }
            }}
            sx={{
                ...sx
            }}
        />
    );
};

export default Search;
