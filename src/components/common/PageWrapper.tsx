import { Box, Card, Dialog, Link, TextField, Button, Typography, DialogTitle } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuAvatar from "../home/MenuAvatar";
import { ReactNode, useEffect, useState } from "react";
import '../../styles/page-wrapper.css';
import { useUser } from "../../contexts/UserContext";
import { useToast } from "../../contexts/ToastContext";
import { userRepository } from "../../repository/userRepository";

interface PageWrapperProps {
    children: ReactNode;
}

const PageWrapper = ({ children }: PageWrapperProps) => {
    const { user, loading, updateUser, refreshUser } = useUser();
    const navigate = useNavigate();
    const { showWarning, showSuccess, showError } = useToast();

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
        <Box
            className='page-wrapper'>
            <Card className='header'>
                <Link
                    href='/'
                    variant="h6"
                    color="inherit"
                    underline="none">EFund</Link>
                <Box
                    className='header-actions'>
                    {loading
                        ? <></>
                        : (user ?
                            <MenuAvatar
                                onInviteUser={() => setOpen(true)}
                                onUsers={() => navigate('/users')}
                                onSignOut={() => updateUser(null)}
                                onSettings={() => navigate('/settings')}
                                onProfile={() => navigate('/profile')}
                                onAdd={onAdd}
                                onMyFundraising={onMyFundraising}
                            />
                            :
                            <>
                                <Link
                                    href='/sign-in'
                                    variant="h6"
                                    color="inherit"
                                    underline="none">Sign In</Link>
                                <Link
                                    href='/sign-up'
                                    variant="h6"
                                    color="inherit"
                                    underline="none">Sign Up</Link>
                            </>
                        )}
                </Box>
            </Card>
            <Box
                sx={{ flexGrow: 1 }}>
                {children}
            </Box>
            <Card
                className='footer'>

            </Card>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
            >
                <Typography
                    sx={{
                        paddingTop: '20px',
                        textAlign: 'center',
                    }}
                    variant="h4">Invite admin</Typography>
                <Box sx={{
                    width: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    padding: '50px'
                }}>
                    <TextField
                        sx={{
                            width: '100%'
                        }}
                        label="Email"
                        value={email}
                        error={!!email && email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i) === null}
                        helperText={!!email && email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i) === null ? 'Invalid email' : ''}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                        variant="contained"
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