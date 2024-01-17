import React from 'react';
import ChangeCreds from "../../templates/ChangeCreds/ChangeCreds";
import Users from "../../services/api/Users";
import useInfo from "../../hooks/useInfo";
import PasswordInput from "./PasswordInput";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import addPasswordValidation from "../../validation/forms/AddPasswordValidation";
import {useNavigate} from "react-router-dom";

const AddPassword = () => {
    const { addInfo } = useInfo();
    const { handleSubmit, register, formState: { errors } } = useForm({
        resolver: yupResolver(addPasswordValidation),
    });
    const navigate = useNavigate()

    const onSubmit = async (data: { password: string; confirmPassword: string }) => {
        try {
            const response = await Users.addPassword({ password: data.password });

            if (response && response.success) {
                addInfo('success', 'Password has been successfully added');
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
        <ChangeCreds title={'Add password'} buttonHandler={handleSubmit(onSubmit)}>
            <form>
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
            </form>
        </ChangeCreds>
    );
};

export default AddPassword;
