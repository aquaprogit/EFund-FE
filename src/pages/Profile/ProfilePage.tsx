import React, { useEffect, useRef } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";
import PageWrapper from "../../components/common/PageWrapper";
import '../../styles/profile-page.css';
import Users, { UpdateUserInfo } from "../../services/api/Users";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import styles from "./ProfilePage.module.css";
import Edit from "../../components/profile/Edit/Edit";
import UserAvatar from "../../components/profile/Avatar/UserAvatar";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ProfilePage = () => {
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const { user, refreshUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        refreshUser();
    }, []);

    const handleSaveClick = async (data: UpdateUserInfo) => {
        await Users.updateInfo(data);
        await refreshUser();
    };

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    const inputFile = useRef(null);

    return (
        <PageWrapper>
            {user ?
                <Box className={styles.mainContent} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '30px',
                    padding: '30px',
                    width: '100%',
                    height: '100%',
                }}>
                    <UserAvatar
                        inputFile={inputFile}
                        refreshUser={refreshUser}
                        url={user.avatarUrl}
                    />
                    <Box className={styles.accordionsContainer}>
                        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                            >
                                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                    Personal data
                                </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>User data description here</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Edit
                                    initialName={user.name}
                                    initialEmail={user.email}
                                    handleSaveClick={handleSaveClick}
                                />
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2bh-content"
                                id="panel2bh-header"
                            >
                                <Typography sx={{ width: '33%', flexShrink: 0 }}>Security</Typography>
                                <Typography sx={{ color: 'text.secondary' }}>
                                    You are currently not an owner
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus,
                                    varius pulvinar diam eros in elit. Pellentesque convallis laoreet
                                    laoreet.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel3bh-content"
                                id="panel3bh-header"
                            >
                                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                    Advanced settings
                                </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>
                                    Filtering has been entirely disabled for whole web server
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
                                    amet egestas eros, vitae egestas augue. Duis vel est augue.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel4bh-content"
                                id="panel4bh-header"
                            >
                                <Typography sx={{ width: '33%', flexShrink: 0 }}>Personal data</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
                                    amet egestas eros, vitae egestas augue. Duis vel est augue.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                    <Box className={styles.personalInfo}>

                    </Box>

                    <Box className={styles.credentialsSection}>
                        <Typography onClick={() => navigate('/change-email')}>Change Email</Typography>
                        {!user.hasMonobankToken && <Typography onClick={() => navigate('/link-token')}>Link Monobank token</Typography>}

                        {
                            !user.hasPassword ?
                                <Typography onClick={() => navigate('/add-password')}>Add Password</Typography>
                                :
                                <Typography onClick={() => navigate('/change-password')}>Change Password</Typography>
                        }
                    </Box>
                </Box>
                : (
                    <>{navigate('/')}</>
                )}
        </PageWrapper >
    );
};

export default ProfilePage;
