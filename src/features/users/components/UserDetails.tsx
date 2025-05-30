import {
    Avatar,
    Box,
    Button,
    Card,
    Chip,
    Container,
    Divider,
    Grid,
    LinearProgress,
    Stack,
    Typography,
    useTheme
} from "@mui/material";
import PageWrapper from "../../../shared/components/PageWrapper";
import { useEffect, useState } from "react";
import { userRepository } from "../api/userRepository";
import { UserDetails as UserDetailsType } from "../models/UserDetails";
import { format } from 'date-fns';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Link } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import TrustScale from './TrustScale';

export const UserDetails = ({ userId }: { userId: string }) => {
    const theme = useTheme();
    const [user, setUser] = useState<UserDetailsType | null>(null);

    const getBadgeColor = (badge: string) => {
        switch (badge.toLowerCase()) {
            case 'verified':
                return {
                    color: theme.palette.success.main,
                    backgroundColor: theme.palette.success.light
                };
            case 'trusted':
                return {
                    color: theme.palette.primary.main,
                    backgroundColor: theme.palette.primary.light
                };
            default:
                return {
                    color: theme.palette.text.secondary,
                    backgroundColor: theme.palette.action.hover
                };
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            const response = await userRepository.getUser(userId);
            if (response.data) {
                response.data = { ...response.data, badges: [{ type: 1, title: 'Verified', description: 'Verified user' }], rating: 3 };
                setUser(response.data);
            }
        }

        fetchUser();
    }, [userId]);

    if (!user) {
        return (
            <PageWrapper>
                <Container>
                    <Typography>Loading...</Typography>
                </Container>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Left Column - Main Content */}
                    <Grid item xs={12} md={8}>
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: 2,
                                border: `1px solid ${theme.palette.divider}`,
                                p: 4
                            }}
                        >
                            {/* Header Section */}
                            <Box sx={{ mb: 4 }}>
                                <Stack direction="row" spacing={3} alignItems="flex-start">
                                    <Avatar
                                        src={user.avatarUrl}
                                        alt={user.name}
                                        sx={{ width: 120, height: 120 }}
                                    />
                                    <Box sx={{ flex: 1 }}>
                                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                                            <Typography variant="h4" sx={{ fontWeight: 600 }}>
                                                {user.name}
                                            </Typography>
                                            {user.badges.map((badge, index) => (
                                                <Chip
                                                    key={index}
                                                    label={badge.title}
                                                    size="small"
                                                    title={badge.description}
                                                    sx={{
                                                        ...getBadgeColor(badge.title),
                                                        fontWeight: 500
                                                    }}
                                                />
                                            ))}
                                        </Stack>
                                        <TrustScale rating={user.rating} />
                                        <Typography variant="body1" color="text.secondary">
                                            {user.description + 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* Details Section */}
                            <Stack spacing={2}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <CalendarTodayIcon color="action" />
                                    <Typography variant="body1">
                                        Joined {format(new Date(user.createdAt), 'MMMM yyyy')}
                                    </Typography>
                                </Stack>
                            </Stack>

                            <Divider sx={{ my: 3 }} />

                            {/* About Section */}
                            {user.description && (
                                <>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                        About
                                    </Typography>
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                        {user.description}
                                    </Typography>
                                </>
                            )}
                        </Card>
                    </Grid>

                    {/* Right Column - Actions */}
                    <Grid item xs={12} md={4}>
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: 2,
                                border: `1px solid ${theme.palette.divider}`,
                                position: 'sticky',
                                top: 100
                            }}
                        >
                            <Box sx={{ p: 3 }}>
                                <Button
                                    component={Link}
                                    to={`/search?userId=${userId}`}
                                    fullWidth
                                    variant="outlined"
                                    color="primary"
                                    size="large"
                                    startIcon={<SearchIcon />}
                                    sx={{ py: 1.5, fontWeight: 600 }}
                                >
                                    View User's Fundraisings
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </PageWrapper>
    );
};