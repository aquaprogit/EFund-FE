import {
    Card,
    CardMedia,
    Typography,
    LinearProgress,
    Box,
    CardContent,
    Button,
    Chip,
    Link,
    useTheme,
    Stack
} from '@mui/material';
import Fundraising from '../../models/Fundraising';
import { useNavigate } from "react-router-dom";
import FundraisingMenu from './FundraisingMenu';

interface FundraisingCardProps {
    fundraising: Fundraising;
    isUser?: boolean;
}

const FundraisingCard = (props: FundraisingCardProps) => {
    const theme = useTheme();
    const { balance, goal, currencyCode, sendUrl } = props.fundraising.monobankJar;
    const progress = (balance / goal) * 100;
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/fundraising/${props.fundraising.id}`);
    };

    return (
        <Card
            onClick={handleClick}
            elevation={0}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                cursor: 'pointer',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4],
                }
            }}
        >
            <CardMedia
                component="img"
                height="200"
                image={props.fundraising.avatarUrl}
                alt={props.fundraising.title}
                sx={{
                    objectFit: 'cover',
                }}
            />
            <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ position: 'relative', mb: 2 }}>
                    {props.isUser && (
                        <Box sx={{ position: 'absolute', right: 0, top: -1 }}>
                            <FundraisingMenu
                                onEdit={() => navigate('/edit-fundraising', { state: { id: props.fundraising.id } })}
                                onDelete={() => { }}
                                fundraisingId={props.fundraising.id}
                                ownerId={props.fundraising.userId}
                            />
                        </Box>
                    )}
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            mb: 1,
                            color: theme.palette.text.primary,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            pr: props.isUser ? 4 : 0
                        }}
                    >
                        {props.fundraising.title}
                    </Typography>
                </Box>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        flexGrow: 1
                    }}
                >
                    {props.fundraising.description}
                </Typography>

                {props.fundraising.tags.length > 0 && (
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            mb: 2,
                            flexWrap: 'wrap',
                            gap: 1
                        }}
                    >
                        {props.fundraising.tags.map((tag, index) => (
                            <Chip
                                key={index}
                                label={tag.toLowerCase()}
                                size="small"
                                sx={{
                                    backgroundColor: theme.palette.primary.light,
                                    color: theme.palette.text.primary,
                                    fontWeight: 500,
                                    fontSize: '0.75rem'
                                }}
                            />
                        ))}
                    </Stack>
                )}

                <Box sx={{ mt: 'auto' }}>
                    <Box sx={{ mb: 1 }}>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                height: 8,
                                borderRadius: 1,
                                backgroundColor: theme.palette.action.hover,
                                mb: 1,
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 1,
                                }
                            }}
                        />
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Typography variant="body2" color="text.secondary">
                                {balance} {currencyCode}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {goal} {currencyCode}
                            </Typography>
                        </Box>
                    </Box>

                    <Link
                        href={sendUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        sx={{ textDecoration: 'none' }}
                    >
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                py: 1,
                                textTransform: 'none',
                                fontWeight: 600
                            }}
                        >
                            Support
                        </Button>
                    </Link>
                </Box>
            </CardContent>
        </Card>
    );
};

export default FundraisingCard;