import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Avatar, Box, Button, IconButton, TextField, Typography } from "@mui/material";
import PageWrapper from "../components/common/PageWrapper";
import '../styles/profile-page.css';
import Users from "../services/api/Users";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import styles from '../components/profile/Edit/Edit.module.css';

const ProfilePage = () => {
    const { user, refreshUser } = useUser();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setName(user?.name ?? '');
        setEmail(user?.email ?? '');
        setAvatarUrl(user?.avatarUrl ?? '');
    }, [user]);

    useEffect(() => {
        refreshUser();
    }, []);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        // Save the updated name and email
        setIsEditing(false);
    };

    const [, setImage] = useState<File>();
    const inputFile = useRef(null);

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length) {
            const filename = files[0].name;

            var parts = filename.split(".");
            const fileType = parts[parts.length - 1];
            console.log("fileType", fileType); //ex: zip, rar, jpg, svg etc.

            setImage(files[0]);

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

    return (
        <PageWrapper>
            {user ?
                <Box className={styles.container}>
                    <Box className='personal-info'>
                        <input
                            style={{ display: "none" }}
                            accept=".jpeg,.png,.jpg"
                            ref={inputFile}
                            onChange={handleFileUpload}
                            type="file"
                        />
                        <IconButton onClick={() => (inputFile.current as HTMLInputElement | null)?.click()}>
                            <Avatar
                                className="profile-avatar"
                                sx={{
                                    height: '200px',
                                    width: '200px'
                                }}
                                src={avatarUrl}
                                alt="Profile Avatar" />
                        </IconButton>
                        {!avatarUrl.includes('Default') && (
                            <Button size="small" onClick={handleDeleteAvatar}>Delete Avatar</Button>
                        )}
                        {isEditing ? (
                            <>
                                <TextField
                                    placeholder="Name"
                                    size="small"
                                    value={name}
                                    onChange={handleNameChange}
                                />
                                <TextField
                                    placeholder="Email"
                                    size="small"
                                    value={email}
                                    onChange={handleEmailChange}
                                />
                                <Button onClick={handleSaveClick}>Save</Button>
                            </>
                        ) : (
                            <>
                                <Typography variant="h6">{name}</Typography>
                                <Typography variant="body1">{email}</Typography>
                                <Button onClick={handleEditClick}>Edit</Button>
                            </>
                        )}
                    </Box>
                </Box>
                : (
                    <>{navigate('/')}</>
                )}
        </PageWrapper >
    );
};

export default ProfilePage;
