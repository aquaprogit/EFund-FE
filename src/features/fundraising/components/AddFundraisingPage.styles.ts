import { Theme } from "@mui/material";

export const styles = {
    container: {
        py: 4
    },
    card: (theme: Theme) => ({
        p: 4,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
    }),
    title: (theme: Theme) => ({
        mb: 4,
        fontWeight: 600,
        color: theme.palette.text.primary
    }),
    form: {
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
    },
    formContent: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 3
    },
    select: (theme: Theme) => ({
        borderRadius: 1,
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.divider,
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
        }
    }),
    menuProps: (theme: Theme) => ({
        PaperProps: {
            elevation: 0,
            sx: {
                maxHeight: 300,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                mt: 1,
                '& .MuiMenuItem-root': {
                    py: 1,
                    px: 2,
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    },
                    '&.Mui-selected': {
                        backgroundColor: theme.palette.primary.light,
                        '&:hover': {
                            backgroundColor: theme.palette.primary.light,
                        }
                    }
                }
            }
        }
    }),
    submitButton: {
        mt: 2,
        py: 1.5,
        textTransform: 'none',
        fontWeight: 600
    }
}; 