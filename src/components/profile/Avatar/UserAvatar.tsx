import React, { ChangeEvent } from 'react';
import { Avatar, Box, Button, IconButton } from "@mui/material";
import styles from './UserAvatar.module.css';
import { UserAvatarProps } from "./UserAvatar.types";
import Users from "../../../services/api/Users";


const UserAvatar: React.FC<UserAvatarProps> = (
    {
        inputFile,
        url,
        refreshUser
    }
) => {
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
    const handleDeleteAvatar = () => {
        Users.deleteAvatar().then((response) => {
            if (response) {
                refreshUser();
            }
        });
    };
    const avatarOverridingStyles = {
        height: '150px',
        width: '150px'
    }
    return (
        <Box className={styles.container}
        >
            <IconButton
                onClick={() => (inputFile?.current as HTMLInputElement | null)?.click()}>
                <Avatar
                    className={styles.profileAvatar}
                    sx={avatarOverridingStyles}
                    src={url}
                    alt="Profile Avatar" />
                <input
                    style={{ display: "none" }}
                    accept=".jpeg,.png,.jpg"
                    ref={inputFile}
                    onChange={handleFileUpload}
                    type="file"
                />
            </IconButton>
            {!url.includes('Default') && (
                <Button
                    className={styles.deleteAvatarButton}
                    style={{}} size="small" onClick={handleDeleteAvatar}>Delete Avatar</Button>
            )}
        </Box>

    );
};

export default UserAvatar;