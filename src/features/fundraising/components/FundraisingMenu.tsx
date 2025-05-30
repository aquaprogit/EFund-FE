import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import { Box, Button, Dialog, Typography } from '@mui/material';
import { useUser } from '../../../contexts/UserContext';
import { fundraisingsRepository } from '../repository/fundraisingsRepository';
import { useToast } from '../../../contexts/ToastContext';

const FundraisingMenu = ({ fundraisingId, ownerId, onDelete, onEdit }: { fundraisingId: string, ownerId: string, onDelete: () => void, onEdit: () => void }) => {
    const { user } = useUser();
    const { showSuccess, showError } = useToast();

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = async () => {
        try {
            const result = await fundraisingsRepository.deleteFundraising(fundraisingId);

            if (result && result.isSuccess) {
                showSuccess('Fundraising deleted successfully!');
                onDelete();
            }
            else {
                showError(result?.error?.message ?? 'Failed to delete fundraising!');
            }
        } catch (error) {
            showError('Failed to delete fundraising!');
        }
        setDialogOpen(false);
    }

    return (
        <Box sx={{
            position: 'absolute',
            right: '10px',
        }}>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={() => onEdit()}>Edit</MenuItem>
                {user && (user.isAdmin || user.id === ownerId) && (<MenuItem onClick={() => setDialogOpen(true)}>Delete</MenuItem>)}
            </Menu>
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px'
                }}>
                    <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                        Are you sure you want to delete this fundraising?
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        This action cannot be undone.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button
                            variant='contained'
                            color='error'
                            onClick={handleDelete}>Delete</Button>
                    </Box>
                </Box>
            </Dialog>
        </Box>
    );
};

export default FundraisingMenu;