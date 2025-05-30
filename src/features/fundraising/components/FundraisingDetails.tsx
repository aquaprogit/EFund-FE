import {
    Box,
    Button,
    Card,
    CardMedia,
    Chip,
    Container,
    Divider,
    Grid,
    LinearProgress,
    Link as MuiLink,
    Stack,
    Typography,
    useTheme
} from "@mui/material";
import PageWrapper from "../../../shared/components/PageWrapper";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { format } from 'date-fns';
import { useQuery } from "@tanstack/react-query";
import { fundraisingsRepository } from "../repository/fundraisingsRepository";
import { getFundraisingDetailsStyles } from "../styles/FundraisingDetails.style";
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent';
import ArticleIcon from '@mui/icons-material/Article';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

interface FundraisingDetailsProps {
    fundraisingId: string;
}

export const FundraisingDetails = ({ fundraisingId }: FundraisingDetailsProps) => {
    const theme = useTheme();
    const styles = getFundraisingDetailsStyles(theme);
    const reportsRef = useRef<HTMLDivElement>(null);

    const scrollToReports = () => {
        reportsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const { data: response, isLoading, error } = useQuery({
        queryKey: ['fundraising', fundraisingId],
        queryFn: () => fundraisingsRepository.getFundraising(fundraisingId)
    });

    if (isLoading) {
        return (
            <PageWrapper>
                <Container>
                    <Typography>Loading...</Typography>
                </Container>
            </PageWrapper>
        );
    }

    if (error || !response || response.error || !response.data) {
        return (
            <PageWrapper>
                <Container>
                    <Typography color="error">
                        Error: {response?.error?.message || 'Failed to load fundraising'}
                    </Typography>
                </Container>
            </PageWrapper>
        );
    }

    const fundraising = response.data;

    return (
        <PageWrapper>
            <Container maxWidth="lg" sx={styles.container}>
                <Grid container spacing={4}>
                    {/* Left Column - Main Content */}
                    <Grid item xs={12} md={8}>
                        <Card
                            elevation={0}
                            sx={styles.mainCard}
                        >
                            <CardMedia
                                component="img"
                                height="400"
                                image={fundraising.avatarUrl}
                                alt={fundraising.title}
                                sx={styles.cardMedia}
                            />
                            <Box sx={styles.contentBox}>
                                <Typography
                                    variant="h4"
                                    sx={styles.title}
                                >
                                    {fundraising.title}
                                </Typography>

                                {/* Tags */}
                                {fundraising.tags.length > 0 && (
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        sx={styles.tagsStack}
                                    >
                                        {fundraising.tags.map((tag: string, index: number) => (
                                            <Chip
                                                key={index}
                                                label={tag}
                                                size="small"
                                                sx={styles.tag}
                                            />
                                        ))}
                                    </Stack>
                                )}

                                {/* Meta Information */}
                                <Stack
                                    direction="row"
                                    spacing={3}
                                    sx={styles.metaStack}
                                >
                                    <Box sx={styles.metaItem}>
                                        <AccessTimeIcon color="action" fontSize="small" />
                                        <Typography variant="body2" color="text.secondary">
                                            Created {format(new Date(fundraising.createdAt), 'MMM dd, yyyy')}
                                        </Typography>
                                    </Box>
                                    <Box sx={styles.metaItem}>
                                        <PersonIcon color="action" fontSize="small" />
                                        <Typography variant="body2" color="text.secondary" component="div">
                                            By{' '}
                                            <MuiLink
                                                component={Link}
                                                to={`/user/${fundraising.userId}`}
                                                sx={{ textDecoration: 'none' }}
                                            >
                                                {fundraising.userName}
                                            </MuiLink>
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Divider sx={styles.divider} />

                                {/* Description */}
                                <Typography
                                    variant="body1"
                                    sx={styles.description}
                                >
                                    {fundraising.description}
                                </Typography>

                                {/* Reports Section */}
                                <Box ref={reportsRef} sx={styles.reportsSection}>
                                    <Typography variant="h5" sx={styles.reportsTitle}>
                                        Reports
                                    </Typography>
                                    <Timeline>
                                        {fundraising.reports?.map((report, index) => (
                                            <TimelineItem key={index}>
                                                <TimelineOppositeContent>
                                                    <Typography sx={styles.timelineDate}>
                                                        {format(new Date(report.createdAt), 'MMM dd, yyyy')}
                                                    </Typography>
                                                </TimelineOppositeContent>
                                                <TimelineSeparator>
                                                    <TimelineDot sx={styles.timelineDot}>
                                                        <ArticleIcon fontSize="small" />
                                                    </TimelineDot>
                                                    {index < (fundraising.reports?.length || 0) - 1 && (
                                                        <TimelineConnector sx={styles.timelineConnector} />
                                                    )}
                                                </TimelineSeparator>
                                                <TimelineContent>
                                                    <Box sx={styles.timelineCard}>
                                                        <Typography variant="body1" sx={styles.timelineContent}>
                                                            {report.description}
                                                        </Typography>
                                                    </Box>
                                                </TimelineContent>
                                            </TimelineItem>
                                        ))}
                                    </Timeline>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>

                    {/* Right Column - Progress and Actions */}
                    <Grid item xs={12} md={4}>
                        <Card
                            elevation={0}
                            sx={styles.sideCard}
                        >
                            <Box sx={styles.sideCardContent}>
                                {/* Progress Section */}
                                <Box sx={styles.progressSection}>
                                    <Typography variant="h4" sx={styles.amountText}>
                                        {fundraising.monobankJar.balance} {fundraising.monobankJar.currencyCode}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={styles.goalText}>
                                        raised of {fundraising.monobankJar.goal} {fundraising.monobankJar.currencyCode} goal
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={fundraising.monobankJar.balance / fundraising.monobankJar.goal * 100}
                                        sx={styles.progressBar}
                                    />
                                </Box>

                                {/* Action Buttons */}
                                <Stack spacing={2}>
                                    <MuiLink
                                        href={fundraising.monobankJar.sendUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={styles.supportLink}
                                    >
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            sx={styles.button}
                                        >
                                            Support Now
                                        </Button>
                                    </MuiLink>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="secondary"
                                        size="large"
                                        startIcon={<ReceiptIcon />}
                                        sx={styles.button}
                                        onClick={scrollToReports}
                                    >
                                        View Receipts
                                    </Button>
                                </Stack>

                                {/* Additional Info */}
                                <Box sx={styles.additionalInfo}>
                                    <Typography variant="body2" color="text.secondary" sx={styles.infoText}>
                                        All donations are processed securely through Monobank
                                    </Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </PageWrapper>
    );
};

export default FundraisingDetails;

