import React, { ChangeEvent, useRef, useState } from "react";
import { Box, Dialog, Paper } from "@mui/material";
import PageWrapper from "../../../shared/components/PageWrapper";
import { userRepository } from "../api/userRepository";
import { useUser } from "../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ProfilePage.module.css";
import UploadImage from "../components/UploadImage";
import ChangePassword from "../components/ChangePassword";
import LinkToken from "../components/LinkToken";
import AddPassword from "../components/AddPassword";
import ChangeEmail from "../components/ChangeEmail";
import { PersonalDataSection } from "../components/profile/PersonalDataSection";
import { SecuritySection } from "../components/profile/SecuritySection";
import { AdvancedSection } from "../components/profile/AdvancedSection";
import { useToast } from "../../../contexts/ToastContext";

const ProfilePage = () => {
    const [openedDialog, setOpenedDialog] = useState<string | false>(false);
    const [expanded, setExpanded] = useState<string | false>(false);
    const { user, refreshUser } = useUser();
    const navigate = useNavigate();
    const inputFile = useRef<HTMLInputElement>(null);
    const { showSuccess, showError } = useToast();


    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length) {
            const response = await userRepository.uploadAvatar(files[0]);
            if (response.isSuccess) {
                await refreshUser();
                showSuccess('Avatar updated successfully');
            } else {
                showError(response.error?.message || 'Failed to update avatar');
            }
        }
    };

    const handleDeleteFile = async () => {
        const response = await userRepository.deleteAvatar();
        if (response.isSuccess) {
            await refreshUser();
            showSuccess('Avatar removed successfully..!!');
        } else {
            showError(response.error?.message || 'Failed to remove avatar');
        }
    };

    return (
        <PageWrapper>
            {
                user ?
                    <Box className={styles.mainContent}>
                        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '30px',
                                width: '100%',
                            }}>
                                <UploadImage
                                    inputFile={inputFile}
                                    handleFileUpload={handleFileUpload}
                                    handleDeleteFile={handleDeleteFile}
                                    url={user!.avatarUrl}
                                />

                                <Box className={styles.accordionsContainer}>
                                    <PersonalDataSection
                                        name={user!.name}
                                        email={user!.email}
                                        description={user!.description}
                                        expanded={expanded}
                                        onChange={handleChange}
                                        onRefresh={refreshUser}
                                        onOpenEmailDialog={() => setOpenedDialog('changeEmail')}
                                    />

                                    <SecuritySection
                                        hasPassword={user!.hasPassword}
                                        expanded={expanded}
                                        onChange={handleChange}
                                        onOpenDialog={setOpenedDialog}
                                    />

                                    <AdvancedSection
                                        hasMonobankToken={user!.hasMonobankToken}
                                        expanded={expanded}
                                        onChange={handleChange}
                                        onOpenDialog={setOpenedDialog}
                                    />
                                </Box>

                                <Dialog
                                    open={!!openedDialog}
                                    onClose={() => setOpenedDialog(false)}
                                    maxWidth="sm"
                                    fullWidth
                                >
                                    {(() => {
                                        switch (openedDialog) {
                                            case 'changePassword':
                                                return <ChangePassword onClose={() => setOpenedDialog(false)} />;
                                            case 'addPassword':
                                                return <AddPassword onClose={() => setOpenedDialog(false)} />;
                                            case 'changeEmail':
                                                return <ChangeEmail onClose={() => setOpenedDialog(false)} />;
                                            case 'linkToken':
                                                return <LinkToken onClose={() => setOpenedDialog(false)} />;
                                            default:
                                                return null;
                                        }
                                    })()}
                                </Dialog>
                            </Box>
                        </Paper>
                    </Box>
                    : <>{navigate('/')}</>
            }
        </PageWrapper>
    );
};

export default ProfilePage; 