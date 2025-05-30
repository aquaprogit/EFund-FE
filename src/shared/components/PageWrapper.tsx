import { Box, Card, Dialog, Link, TextField, Button, Typography, DialogTitle, Container, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuAvatar from "../../features/users/components/MenuAvatar";
import { ReactNode, useEffect, useState } from "react";
import '../../styles/page-wrapper.css';
import { useUser } from "../../contexts/UserContext";
import { useToast } from "../../contexts/ToastContext";
import { userRepository } from "../../features/users/api/userRepository";

interface PageWrapperProps {
    children: ReactNode;
}

const PageWrapper = ({ children }: PageWrapperProps) => {
    const { user, loading, updateUser, refreshUser } = useUser();
    const navigate = useNavigate();
    const { showWarning, showSuccess, showError } = useToast();
    const theme = useTheme();

    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        refreshUser();
    }, []);

    const onAdd = () => {
        if (!user!.hasMonobankToken) {
            showWarning('Please link monobank token to your account to get access to this functionality')
        }
        else {
            navigate('/add-fundraising')
        }
    }
    const onMyFundraising = () => {
        navigate('/my-fundraisings')
    }

    return (
        <Box className='page-wrapper'>
            <Box
                component="header"
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    position: 'sticky',
                    top: 0,
                    zIndex: 1100,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            py: 2
                        }}
                    >
                        <Link
                            href='/'
                            variant="h5"
                            color="primary"
                            sx={{
                                fontWeight: 'bold',
                                textDecoration: 'none',
                                '&:hover': {
                                    color: theme.palette.primary.dark
                                }
                            }}
                        >
                            EFund
                        </Link>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            {loading ? (
                                <></>
                            ) : (
                                user ? (
                                    <MenuAvatar
                                        onInviteUser={() => setOpen(true)}
                                        onUsers={() => navigate('/users')}
                                        onSignOut={() => updateUser(null)}
                                        onSettings={() => navigate('/settings')}
                                        onProfile={() => navigate('/profile')}
                                        onAdd={onAdd}
                                        onMyFundraising={onMyFundraising}
                                    />
                                ) : (
                                    <>
                                        <Button
                                            color="primary"
                                            onClick={() => navigate('/sign-in')}
                                        >
                                            Sign In
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => navigate('/sign-up')}
                                        >
                                            Sign Up
                                        </Button>
                                    </>
                                )
                            )}
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
            </Box>

            <Box
                component="footer"
                sx={{
                    backgroundColor: theme.palette.grey[100],
                    py: 4,
                    mt: 'auto'
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                    >
                        © {new Date().getFullYear()} EFund. All rights reserved.
                    </Typography>
                </Container>
            </Box>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        p: 2
                    }
                }}
            >
                <DialogTitle sx={{ textAlign: 'center' }}>
                    Invite Admin
                </DialogTitle>
                <Box sx={{
                    width: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                    p: 4
                }}>
                    <TextField
                        fullWidth
                        label="Email"
                        value={email}
                        error={!!email && email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i) === null}
                        helperText={!!email && email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i) === null ? 'Invalid email' : ''}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={async () => {
                            const result = await userRepository.inviteAdmin(email);
                            if (result.isSuccess) {
                                showSuccess('User invited successfully');
                            }
                            else {
                                showError('Error during inviting user');
                            }
                            setOpen(false);
                        }}
                    >
                        Invite
                    </Button>
                </Box>
            </Dialog>
        </Box>
    );
};

export default PageWrapper;