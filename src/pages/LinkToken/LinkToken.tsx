import React, { useState } from 'react';
import ChangeCreds from "../../templates/ChangeCreds/ChangeCreds";
import TextField from "@mui/material/TextField";
import Monobank from "../../services/api/Monobank/Monobank";
import useInfo from "../../hooks/useInfo";
import { Link, Typography } from '@mui/material';
import { useUser } from '../../contexts/UserContext';

const LinkToken = (props: { onClose: () => void }) => {
    const [token, setToken] = useState('')
    const { refreshUser } = useUser();
    const { sendNotification: addInfo } = useInfo()
    const onSubmit = async () => {
        try {
            const response = await Monobank.linkToken(token);
            if (response && response.error) {
                addInfo('error', response.error.message)

            }
            else if (response && response.success) {
                addInfo('success', 'Token has been successfully linked')
                await refreshUser();
                props.onClose();
            }
        }
        catch (e) {
            addInfo('error', 'Unexpected error')
        }
    }
    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setToken(event.target.value);
    }
    return (
        <ChangeCreds buttonLabel='Link' buttonHandler={onSubmit} title='Link monobank token'>
            <TextField
                style={{ width: '300px' }}
                value={token}
                required
                onChange={onChangeHandler}
                placeholder={'Token'}
                size={'small'}
            />
            <Typography
                variant={'caption'}
                sx={{ color: 'text.secondary' }}>You can get token <Link underline='hover' href='https://api.monobank.ua/' target='_blank' rel='noreferrer'>here</Link>
            </Typography>
        </ChangeCreds>
    );
};

export default LinkToken;