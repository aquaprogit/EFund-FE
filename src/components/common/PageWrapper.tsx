import { Box, Card, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuAvatar from "../home/MenuAvatar";
import { ReactNode, useEffect } from "react";
import '../../styles/page-wrapper.css';
import { useUser } from "../../contexts/UserContext";

interface PageWrapperProps {
    children: ReactNode;
}

const PageWrapper = ({ children }: PageWrapperProps) => {
    const { user, loading, updateUser, refreshUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        refreshUser();
    }, []);

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
                                onSignOut={() => updateUser(null)}
                                onSettings={() => navigate('/settings')}
                                onProfile={() => navigate('/profile')}
                                onAdd={() => navigate('/add-fundraising')}
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
                Footer
            </Card>
        </Box>
    );
};

export default PageWrapper;