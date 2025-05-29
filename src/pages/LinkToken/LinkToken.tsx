import React, { useState } from 'react';
import ChangeCreds from "../../templates/ChangeCreds/ChangeCreds";
import TextField from "@mui/material/TextField";
import { monobankRepository } from "../../repository/monobankRepository";
import { Link, Typography } from '@mui/material';
import { useUser } from '../../contexts/UserContext';
import { useToast } from '../../contexts/ToastContext';

const LinkToken = (props: { onClose: () => void }) => {
    const [token, setToken] = useState('')
    const { refreshUser } = useUser();
    const { showError, showSuccess } = useToast();
    const onSubmit = async () => {
        try {
            const response = await monobankRepository.linkToken(token);
            if (response && response.error) {
                showError(response.error.message);
            }
            else if (response && response.isSuccess) {
                showSuccess('Token has been successfully linked');
                await refreshUser();
                props.onClose();
            }
        }
        catch (e) {
            showError('Unexpected error');
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