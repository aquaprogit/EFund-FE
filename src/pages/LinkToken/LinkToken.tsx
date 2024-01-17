import React, {useState} from 'react';
import ChangeCreds from "../../templates/ChangeCreds/ChangeCreds";
import TextField from "@mui/material/TextField";
import Monobank from "../../services/api/Monobank/Monobank";
import useInfo from "../../hooks/useInfo";
import {useNavigate} from "react-router-dom";

const LinkToken = () => {
    const [token, setToken] = useState('')
    const {addInfo} = useInfo()
    const navigate = useNavigate()
    const onSubmit = async () => {
        try {
            const response = await Monobank.linkToken(token);
            if (response && response.error) {
                addInfo('error', response.error.message)
                navigate('/profile')
            }
            else if (response && response.success) {
                addInfo('success', 'Token has been successfully linked')

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
        <ChangeCreds buttonHandler={onSubmit} title={'Link monobank token'}>
            <TextField
                value={token}
                required
                onChange={onChangeHandler}
                placeholder={'Token'}
                size={'small'}
            />
        </ChangeCreds>
    );
};

export default LinkToken;