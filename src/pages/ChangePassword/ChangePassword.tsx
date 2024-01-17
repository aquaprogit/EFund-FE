import React from 'react';
import ChangeCreds from "../../templates/ChangeCreds/ChangeCreds";
import Users from "../../services/api/Users";
import useInfo from "../../hooks/useInfo";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import PasswordInput from "../AddPassword/PasswordInput";
import {useNavigate} from "react-router-dom";
import changePasswordValidation from "../../validation/forms/ChangePasswordValidation";

const ChangePassword = () => {
    const { addInfo } = useInfo();
    const { handleSubmit, register, formState: { errors } } = useForm({
        resolver: yupResolver(changePasswordValidation),
    });
    const navigate = useNavigate()

    const onSubmit = async (data: { password: string; newPassword: string }) => {
        try {
            const response = await Users.changePassword({oldPassword: data.password, newPassword: data.newPassword});

            if (response && response.success) {
                addInfo('success', 'Password has been successfully changed');
                navigate('/profile')
            } else if (response && response.error) {
                addInfo('error', response.error.message);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            addInfo('error', 'An error occurred while adding the password.');
        }
    };
    return (
        <ChangeCreds title={'Change password'} buttonHandler={handleSubmit(onSubmit)}>
            <form>
                <PasswordInput
                    register={register('password')}
                    placeholder={'Old password'}
                    error={errors['password']}
                />

                <PasswordInput
                    register={register('newPassword')}
                    placeholder={'New Password'}
                    error={errors['newPassword']}
                />
            </form>
        </ChangeCreds>
    );
};

export default ChangePassword;
