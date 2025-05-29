import React, { ChangeEvent, useEffect, useRef } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Dialog, Typography } from "@mui/material";
import PageWrapper from "../../components/common/PageWrapper";
import '../../styles/profile-page.css';
import { userRepository } from "../../repository/userRepository";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import styles from "./ProfilePage.module.css";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UploadImage from "../../components/UploadImage";
import ChangePassword from "../ChangePassword/ChangePassword";
import AddPassword from "../AddPassword/AddPassword";
import ChangeEmail from "../ChangeEmail/ChangeEmail";
import LinkToken from "../LinkToken/LinkToken";
import EditName from "../../components/common/EditName";
import { ApiResponse } from "../../models/api/BaseErrorResponse";

const ProfilePage = () => {
    const [openedDialogue, setOpenedDialogue] = React.useState<string | false>(false);
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const { user, refreshUser, loading } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        refreshUser();
    }, []);

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    const inputFile = useRef(null);
    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length) {
            userRepository.uploadAvatar(files[0]).then((response: ApiResponse<{}>) => {
                if (response.isSuccess) {
                    refreshUser();
                }
            });
        }
    };
    const handleDeleteFile = () => {
        userRepository.deleteAvatar().then((response: ApiResponse<{}>) => {
            if (response.isSuccess) {
                refreshUser();
            }
        });
    }

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
                    <UploadImage
                        inputFile={inputFile}
                        handleFileUpload={handleFileUpload}
                        handleDeleteFile={handleDeleteFile}
                        url={user.avatarUrl}
                    />
                    <Box className={styles.accordionsContainer}>
                        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                    Personal data
                                </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>User data description here</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 2,
                                    alignItems: 'center',
                                }}>
                                </Box>
                                <EditName
                                    initialName={user.name}
                                    refreshUser={async () => await refreshUser()}
                                />
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 2,
                                    alignItems: 'center',
                                }}>
                                    <Typography variant="body1">Email:</Typography>
                                    <Typography variant="body1">{user.email}</Typography>
                                    <Button size="small" onClick={() => setOpenedDialogue('changeEmail')}>Change Email</Button>
                                </Box>
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
                                    Security settings
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignContent: 'center' }}>
                                    {user.hasPassword
                                        ? <Button disabled={!user.hasPassword} onClick={() => setOpenedDialogue('changePassword')}>Change Password</Button>
                                        : <Button disabled={user.hasPassword} onClick={() => setOpenedDialogue('addPassword')}>Add Password</Button>
                                    }
                                    <Button onClick={() => setOpenedDialogue('changeEmail')}>Change Email</Button>
                                </Box>

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
                                    You can see more advanced settings here
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button onClick={() => setOpenedDialogue('linkToken')}>{user.hasMonobankToken ? 'Update Token' : 'Link Token'}</Button>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                    <Dialog
                        open={!!openedDialogue}
                        onClose={() => setOpenedDialogue(false)}
                    >
                        {(() => {
                            switch (openedDialogue) {
                                case 'changePassword':
                                    return <ChangePassword onClose={() => setOpenedDialogue(false)} />;
                                case 'addPassword':
                                    return <AddPassword onClose={() => setOpenedDialogue(false)} />;
                                case 'changeEmail':
                                    return <ChangeEmail onClose={() => setOpenedDialogue(false)} />;
                                case 'linkToken':
                                    return <LinkToken onClose={() => setOpenedDialogue(false)} />;
                                default:
                                    return <></>;
                            }
                        })()}
                    </Dialog>
                </Box>
                : (
                    loading
                        ? <></>
                        : <>{navigate('/')}</>
                )}
        </PageWrapper >
    );
};

export default ProfilePage;
