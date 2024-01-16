import React, {useState} from 'react';
import {Box, Button, Typography} from "@mui/material";
import styles from './ChangeEmail.module.css';
import TextField from "@mui/material/TextField";

import Auth from "../../services/api/Auth";
import useInfo from "../../hooks/useInfo";
import useUser from "../../hooks/useUser";

const ConfirmChangeEmail = () => {
    const [code, setCode] = useState('');
    const {user} = useUser()
    const {addInfo} = useInfo()
    // const {state: {newEmail}} = useLocation();
    const email = 'andrijmalarcuk8@gmail.com'
    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCode(event.target.value);
    }
    const onSubmit: React.MouseEventHandler<HTMLButtonElement> = async () => {

        const response = await Auth.confirmChangeEmail({newEmail: email, code: parseInt(code, 10)})
        if (response && response.error) {
            addInfo('error', response.error.message)
        }

    }
    const resendConfirmationCode = async () => {
        console.log(user)
        const response = await Auth.resendConfirmationCode({userId: user!.id})
        if (response && response.success) {
            addInfo('success', 'Confirmation code has been resent')
        }
        else if (response && response.error) {
            addInfo('error', response.error.message)
        }

    }
    return (
        <Box className={styles.confirmContainer}>
            <Typography variant={'h4'}>Enter confirmation code</Typography>
            <Box className={styles.validation}>
                <TextField
                    size={"small"}
                    placeholder={'Confirmation code'}
                    value={code}
                    onChange={onChangeHandler}
                />
                <Button onClick={resendConfirmationCode}>Resend confirmation code</Button>
            </Box>
            <Button size={'large'} onClick={onSubmit}>Submit</Button>
        </Box>
    );
};

export default ConfirmChangeEmail;