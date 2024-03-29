import { Card, CardMedia, Typography, LinearProgress, Box, CardContent, Button, Chip, Link, Accordion, AccordionActions, AccordionDetails, AccordionSummary, Avatar } from '@mui/material';
import Fundraising from '../../models/Fundraising';
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';

interface FundraisingCardProps {
    fundraising: Fundraising;
    size: 'small' | 'large';
    selected?: boolean;
    onClick?: (id: string) => void;
    isUser?: boolean
}

const FundraisingCard = (props: FundraisingCardProps) => {

    const [openedReport, setOpenedReport] = useState<string | false>(false);
    const { balance, goal, currencyCode, sendUrl } = props.fundraising.monobankJar;
    const textColor = props.selected ? 'primary.contrastText' : 'text.primary';
    const progress = (balance / goal) * 100;
    const navigate = useNavigate()
    const onEditClick = () => {
        navigate('/edit-fundraising', { state: { id: props.fundraising.id } })
    }
    return (
        props.size === 'small' ?
            <>
                <Card
                    sx={{
                        bgcolor: props.selected ? 'primary.light' : 'background.paper',
                        display: 'flex',
                        position: 'relative',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '15px',
                        padding: '10px',
                        paddingLeft: '20px',
                        height: '100%',
                        width: 600,
                    }}
                >
                    <CardMedia
                        sx={{
                            height: 100,
                            width: 100,
                        }}
                    >
                        <Avatar
                            style={{
                                objectFit: 'fill',
                                height: 100,
                                width: 100,
                            }}
                            src={props.fundraising.avatarUrl}
                            alt={props.fundraising.title}
                        />
                        {/* <img
                            style={{
                                objectFit: 'fill',
                                height: 100,
                                width: 100,
                            }}
                            src={props.fundraising.avatarUrl}
                            alt={props.fundraising.title}
                        /> */}
                    </CardMedia>
                    <CardContent sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5
                    }}>
                        <Typography variant="h5" textOverflow={'ellipsis'} overflow={'hidden'} maxHeight={'30px'} component="div" color={textColor}>
                            {props.fundraising.title.length > 37 ? props.fundraising.title.substring(0, 37) + '...' : props.fundraising.title}
                        </Typography>
                        <Typography variant="body2" textOverflow={'ellipsis'} overflow={'hidden'} maxHeight={'20px'} color={textColor}>
                            {props.fundraising.description.length > 69 ? props.fundraising.description.substring(0, 69) + '...' : props.fundraising.description}
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '10px',
                                marginTop: '10px',
                            }}
                        >
                            <Typography variant="body2" color={textColor}>
                                {balance} {currencyCode}
                            </Typography>
                            <LinearProgress sx={{ flexGrow: 1 }} variant="determinate" value={progress} />
                            <Typography variant="body2" color={textColor}>
                                {goal} {currencyCode}
                            </Typography>
                            {
                                props.isUser &&
                                <Button
                                    color={props.selected ? 'secondary' : 'primary'}
                                    variant="contained"
                                    onClick={onEditClick}>
                                    Edit
                                </Button>
                            }
                            <Button
                                color={props.selected ? 'secondary' : 'primary'}
                                variant="contained"
                                onClick={() => props.onClick && props.onClick(props.fundraising.id)}>
                                More Info
                            </Button>
                        </Box>
                    </CardContent>
                </Card >
            </>
            :
            <>
                <Card
                    sx={{
                        display: 'flex',
                        position: 'relative',
                        flexDirection: 'row',
                        alignItems: 'stretch',
                        gap: '15px',
                        padding: '10px',
                        height: '100%',
                        width: '100%',
                    }}
                >
                    <CardMedia
                        sx={{
                            height: 175,
                            width: 175,
                        }}
                    >
                        <Avatar
                            style={{
                                objectFit: 'fill',
                                height: 175,
                                width: 175,
                            }}
                            src={props.fundraising.avatarUrl}
                            alt={props.fundraising.title}
                        />
                        {/* <img
                            style={{
                                objectFit: 'fill',
                                height: 175,
                                width: 175,
                            }}
                            src={props.fundraising.avatarUrl}
                            alt={props.fundraising.title}
                        /> */}
                    </CardMedia>
                    <CardContent sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5
                    }}>
                        <Typography style={{ wordWrap: 'break-word' }} variant="h4" component="div" textOverflow={'ellipsis'} overflow={'hidden'} color={textColor}>
                            {props.fundraising.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {props.fundraising.tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag}
                                    color='primary'
                                    variant='filled'
                                />
                            ))}
                        </Box>
                        <Typography variant="body1" textOverflow={'ellipsis'} overflow={'hidden'} color={textColor}>
                            {props.fundraising.description}
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                alignSelf: 'center',
                                gap: '10px',
                                width: '70%',
                                marginTop: '10px',
                            }}
                        >
                            <Typography variant="body2">
                                {balance} {currencyCode}
                            </Typography>
                            <LinearProgress color='primary' sx={{ flexGrow: 1 }} variant="determinate" value={progress} />
                            <Typography variant="body2" color={textColor}>
                                {goal} {currencyCode}
                            </Typography>
                        </Box>
                        <Link
                            href={sendUrl}
                            sx={{
                                alignSelf: 'center',
                                marginTop: '10px',
                                textDecoration: 'none',
                            }}
                            target='_blank'
                            rel="noopener noreferrer"
                        >
                            <Button variant="contained" color="primary" style={{ fontWeight: 'bold' }}>
                                Go to Monobank
                            </Button>
                        </Link>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }} mt={5}>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                >
                                    Accordion 1
                                </AccordionSummary>
                                <AccordionDetails>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel2-content"
                                    id="panel2-header"
                                >
                                    Accordion 2
                                </AccordionSummary>
                                <AccordionDetails>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel3-content"
                                    id="panel3-header"
                                >
                                    Accordion Actions
                                </AccordionSummary>
                                <AccordionDetails>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                                </AccordionDetails>
                                <AccordionActions>
                                    <Button>Cancel</Button>
                                    <Button>Agree</Button>
                                </AccordionActions>
                            </Accordion>
                        </Box>
                    </CardContent>
                </Card >
            </>
    );
};

export default FundraisingCard;