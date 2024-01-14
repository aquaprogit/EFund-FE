import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import PageWrapper from "../../components/common/PageWrapper";
import '../../styles/profile-page.css';
import Users, {UpdateUserInfo} from "../../services/api/Users";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import styles from "./ProfilePage.module.css";
import Edit from "../../components/profile/Edit/Edit";
import UserAvatar from "../../components/profile/Avatar/UserAvatar";

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

    return (
        <PageWrapper>
            {user ?
                <Box className={styles.container}>
                    <UserAvatar
                        inputFile={inputFile}
                        refreshUser={refreshUser}
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
                : (
                    <>{navigate('/')}</>
                )}
        </PageWrapper >
    );
};

export default ProfilePage;
