import React, {ChangeEvent, useEffect, useRef} from "react";
import {Box, Typography} from "@mui/material";
import PageWrapper from "../../components/common/PageWrapper";
import '../../styles/profile-page.css';
import Users, {UpdateUserInfo} from "../../services/api/Users";
import { useUser } from "../../contexts/UserContext";
import {useNavigate} from "react-router-dom";
import styles from "./ProfilePage.module.css";
import Edit from "../../components/profile/Edit/Edit";
import UploadImage from "../../components/profile/UploadImage/UploadImage";

const ProfilePage = () => {
    const { user, refreshUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        refreshUser();
    }, []);

    const handleSaveClick = async (data: UpdateUserInfo) => {
        await Users.updateInfo(data);
        await refreshUser();
    };

    const inputFile = useRef(null);
    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length) {
            Users.uploadAvatar(files[0]).then((response) => {
                if (response) {
                    refreshUser();
                }
            });
        }
    };
    const handleDeleteFile = () => {
        Users.deleteAvatar().then((response) => {
            if (response) {
                refreshUser();
            }
        });
    }

    return (
        <PageWrapper>
            {user ?
                <Box className={styles.mainContent}>
                    <Box className={styles.container}>
                        <UploadImage
                            inputFile={inputFile}
                            handleFileUpload={handleFileUpload}
                            handleDeleteFile={handleDeleteFile}
                            url={user.avatarUrl}
                        />
                        <Box className={styles.personalInfo}>
                            <Edit
                                initialName={user.name}
                                initialEmail={user.email}
                                handleSaveClick={handleSaveClick}
                            />
                        </Box>

                    </Box>
                    <Box className={styles.credentialsSection}>
                        <Typography onClick={() => navigate('/change-email')}>Change Email</Typography>
                        {!user.hasMonobankToken &&  <Typography onClick={() => navigate('/link-token')}>Link Monobank token</Typography>}

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
