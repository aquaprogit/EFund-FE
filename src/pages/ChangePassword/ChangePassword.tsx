import ChangeCreds from "../../templates/ChangeCreds/ChangeCreds";
import { userRepository } from "../../repository/userRepository";
import { useToast } from "../../contexts/ToastContext";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import PasswordInput from "../AddPassword/PasswordInput";
import changePasswordValidation from "../../validation/forms/ChangePasswordValidation";
import { Box } from "@mui/material";

const ChangePassword = (props: { onClose: () => void }) => {
    const { showSuccess, showError } = useToast();
    const { handleSubmit, register, formState: { errors } } = useForm({
        resolver: yupResolver(changePasswordValidation),
        reValidateMode: 'onChange',
        mode: 'onTouched'
    });

    const onSubmit = async (data: { password: string; newPassword: string }) => {
        try {
            const response = await userRepository.changePassword({ oldPassword: data.password, newPassword: data.newPassword });

            if (response.isSuccess) {
                showSuccess('Password has been successfully changed');
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
        <ChangeCreds buttonLabel="Change password" title='Change password' buttonHandler={handleSubmit(onSubmit)}>
            <form>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} >
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
                </Box>
            </form>
        </ChangeCreds>
    );
};

export default ChangePassword;
