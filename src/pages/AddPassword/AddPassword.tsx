import React from 'react';
import ChangeCreds from "../../templates/ChangeCreds/ChangeCreds";
import Users from "../../services/api/Users";
import useInfo from "../../hooks/useInfo";
import PasswordInput from "./PasswordInput";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import addPasswordValidation from "../../validation/forms/AddPasswordValidation";
import { Box } from '@mui/material';
import { useUser } from '../../contexts/UserContext';

const AddPassword = (props: { onClose: () => void }) => {
    const { refreshUser } = useUser();
    const { sendNotification } = useInfo();
    const { handleSubmit, register, formState: { errors } } = useForm({
        resolver: yupResolver(addPasswordValidation),
        reValidateMode: 'onChange',
        mode: 'onTouched'
    });

    const onSubmit = async (data: { password: string; confirmPassword: string }) => {
        try {
            const response = await Users.addPassword({ password: data.password });

            if (response && response.success) {
                sendNotification('success', 'Password has been successfully added');
                await refreshUser();
                props.onClose();
            } else if (response && response.error) {
                sendNotification('error', response.error.message);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            sendNotification('error', 'An error occurred while adding the password.');
        }
    };

    return (
        <ChangeCreds buttonLabel='Add password' title={'Add password'} buttonHandler={handleSubmit(onSubmit)}>
            <form>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} >
                    <PasswordInput
                        register={register('password')}
                        placeholder={'Password'}
                        error={errors['password']}
                    />

                    <PasswordInput
                        register={register('confirmPassword')}
                        placeholder={'Confirm password'}
                        error={errors['confirmPassword']}
                    />
                </Box>
            </form>
        </ChangeCreds>
    );
};

export default AddPassword;
