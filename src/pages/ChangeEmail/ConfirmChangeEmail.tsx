import React, { useState } from 'react';
import { Box, Button, Typography } from "@mui/material";
import styles from './ChangeEmail.module.css';
import TextField from "@mui/material/TextField";

import Auth from "../../services/api/Auth";
import useInfo from "../../hooks/useInfo";
import { useUser } from "../../contexts/UserContext";

const ConfirmChangeEmail = (props: { newEmail: string, onClose: () => void }) => {
    const [code, setCode] = useState('');
    const { user, refreshUser } = useUser();
    const { sendNotification: addInfo } = useInfo();

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCode(event.target.value);
    }
    const onSubmit: React.MouseEventHandler<HTMLButtonElement> = async () => {
        try {
            const response = await Auth.confirmChangeEmail({ newEmail: props.newEmail, code: parseInt(code, 10) })
            if (response && response.error) {
                addInfo('error', response.error.message)
            }
            else {
                addInfo('success', 'Email has been successfully changed');
                await refreshUser();
                props.onClose();
            }
        }
        catch (e) {
            addInfo('error', 'Unexpected error')
        }


    }
    const resendConfirmationCode = async () => {
        try {
            const response = await Auth.resendConfirmationCode({ userId: user!.id })
            if (response) {
                if (response.success) {
                    addInfo('success', 'Confirmation code has been resent')
                }
                else if (response.error) {
                    addInfo('error', response.error.message)
                }
            }

        }
        catch (e) {
            addInfo('error', 'Unexpected error')
        }
    }
    return (
        <Box className={styles.wrapper}>
            <Typography variant={'h5'}>Enter confirmation code</Typography>
            <Box className={styles.validation}>
                <TextField
                    size={"small"}
                    placeholder={'Confirmation code'}
                    value={code}
                    onChange={onChangeHandler}
                />
                <Button size='small' onClick={resendConfirmationCode}>Resend code</Button>
            </Box>
            <Button size={'large'} onClick={onSubmit}>Submit</Button>
        </Box>
    );
};

export default ConfirmChangeEmail;