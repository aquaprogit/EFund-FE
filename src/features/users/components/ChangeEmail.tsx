import React, { useState } from 'react';
import ChangeCreds from "./ChangeCreds";
import TextField from "@mui/material/TextField";
import { userRepository } from "../api/userRepository";
import { useToast } from "../../../contexts/ToastContext";
import ConfirmChangeEmail from './ConfirmChangeEmail';

const ChangeEmail = (props: { onClose: () => void }) => {
    const [newEmail, setNewEmail] = useState('');
    const error = !!newEmail && !!!newEmail.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
    const [confirmationSent, setConfirmationSent] = useState(false);
    const { showError } = useToast();
    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewEmail(event.target.value);
    }
    const onSubmit = async () => {
        try {
            const response = await userRepository.changeEmail(newEmail);
            if (!response.isSuccess) {
                showError(response.error?.message || 'Failed to change email');
            } else {
                setConfirmationSent(true);
            }
        }
        catch (e) {
            showError('Unexpected error')
        }
    }
    return (
        confirmationSent
            ?
            <ConfirmChangeEmail newEmail={newEmail} onClose={props.onClose} />
            : <>
                <ChangeCreds buttonLabel='Send code' title={'Change Email'} buttonHandler={onSubmit}>
                    <TextField
                        error={error}
                        helperText={error ? 'Invalid email format' : ''}
                        style={{ width: '300px' }}
                        size={"small"}
                        type={'email'}
                        placeholder={'New Email'}
                        value={newEmail}
                        onChange={onChangeHandler} />
                </ChangeCreds>
            </>
    );
};

export default ChangeEmail;