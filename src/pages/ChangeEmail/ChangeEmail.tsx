import React, {useState} from 'react';
import PageWrapper from "../../components/common/PageWrapper";
import ChangeCreds from "../../templates/ChangeCreds/ChangeCreds";
import TextField from "@mui/material/TextField";
import {useNavigate} from "react-router-dom";
import useUser from "../../hooks/useUser";
import Auth from "../../services/api/Auth";

import useInfo from "../../hooks/useInfo";

const ChangeEmail = () => {
    const [newEmail, setNewEmail] = useState('');
    const {user} = useUser()
    const navigate = useNavigate();
    const {addInfo} = useInfo()
    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewEmail(event.target.value);
    }
    const onSubmit = async () => {
        const response = await Auth.changeEmail({
            newEmail
        })
        console.log(response)
        if (response.error) {
            addInfo('error', response.error.message);
            if (response.error.errorCode === 4) {
                return await Auth.resendConfirmationCode({userId: user!.id})
            }


            return;
        }
        if (response.success) {
            navigate('/confirm-change-email', {state: {newEmail}});
        }

    }
    return (
        <PageWrapper>
            <ChangeCreds title={'Change Email'} buttonHandler={onSubmit}>
                <TextField placeholder={'New Email'} value={newEmail} onChange={onChangeHandler}/>
            </ChangeCreds>
        </PageWrapper>
    );
};

export default ChangeEmail;