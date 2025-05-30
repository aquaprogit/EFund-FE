import React from 'react';
import ChangeCreds from "./ChangeCreds";
import { userRepository } from "../api/userRepository";
import { useToast } from "../../../contexts/ToastContext";
import PasswordInput from "./PasswordInput";
import { Box } from '@mui/material';
import { useUser } from '../../../contexts/UserContext';
import { addPasswordSchema, type AddPasswordFormData } from '../../auth/schemas/schemas';
import { useZodForm } from '../../../shared/hooks/useZodForm';

const AddPassword = (props: { onClose: () => void }) => {
    const { refreshUser } = useUser();
    const { showSuccess, showError } = useToast();
    const { handleSubmit, register, formState: { errors } } = useZodForm(addPasswordSchema);

    const onSubmit = async (data: AddPasswordFormData) => {
        try {
            const response = await userRepository.addPassword({ password: data.password });

            if (response.isSuccess) {
                showSuccess('Password has been successfully added');
                await refreshUser();
                props.onClose();
            } else if (response.error) {
                showError(response.error.message);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            showError('An error occurred while adding the password.');
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
