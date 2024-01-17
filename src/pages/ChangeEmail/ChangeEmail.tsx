import React, {useState} from 'react';
import PageWrapper from "../../components/common/PageWrapper";
import ChangeCreds from "../../templates/ChangeCreds/ChangeCreds";
import TextField from "@mui/material/TextField";
import {useNavigate} from "react-router-dom";
import Auth from "../../services/api/Auth";

import useInfo from "../../hooks/useInfo";

const ChangeEmail = () => {
    const [newEmail, setNewEmail] = useState('');
    const navigate = useNavigate();
    const {addInfo} = useInfo()
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
                navigate('/confirm-change-email', {state: {newEmail}});
            }
        }
        catch (e) {
            addInfo('error', 'Unexpected error')
        }


    }
    return (
        <PageWrapper>
            <ChangeCreds title={'Change Email'} buttonHandler={onSubmit}>
                <TextField type={'email'} placeholder={'New Email'} value={newEmail} onChange={onChangeHandler}/>
            </ChangeCreds>
        </PageWrapper>
    );
};

export default ChangeEmail;