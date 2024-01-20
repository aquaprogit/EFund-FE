import React, { useState } from 'react';
import ChangeCreds from "../../templates/ChangeCreds/ChangeCreds";
import TextField from "@mui/material/TextField";
import Auth from "../../services/api/Auth";
import useInfo from "../../hooks/useInfo";
import ConfirmChangeEmail from './ConfirmChangeEmail';

const ChangeEmail = (props: { onClose: () => void }) => {
    const [newEmail, setNewEmail] = useState('');
    const error = !!newEmail && !!!newEmail.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
    const [confirmationSent, setConfirmationSent] = useState(false);
    const { sendNotification: addInfo } = useInfo();
    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewEmail(event.target.value);
    }
    const onSubmit = async () => {
        try {
            const response = await Auth.changeEmail({
                newEmail
            })
            if (response.error) {
                addInfo('error', response.error.message);
            }
            else if (response.success || response.error.errorCode === 4) {
                setConfirmationSent(true);
            }
        }
        catch (e) {
            addInfo('error', 'Unexpected error')
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