import React, {useState} from 'react';
import {Button, TextField} from "@mui/material";
import {EditProps} from "./Edit.types";

const Edit: React.FC<EditProps> = (
    {
        initialName,
        initialEmail,
        handleSaveClick,
    }
) => {

    const [name, setName] = useState(initialName);
    const [email, setEmail] = useState(initialEmail);
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };
    const updateUserInfo = () => {
        const updateInfo = {
            name,
            email
        }
        handleSaveClick(updateInfo);
    }
    return (
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
            <Button onClick={updateUserInfo}>Save</Button>
        </>
    );
};

export default Edit;