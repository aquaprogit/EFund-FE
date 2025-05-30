import ChangeCreds from "./ChangeCreds";
import { userRepository } from "../api/userRepository";
import { useToast } from "../../../contexts/ToastContext";
import PasswordInput from "./PasswordInput";
import { Box } from "@mui/material";
import { changePasswordSchema, type ChangePasswordFormData } from "../../auth/schemas/schemas";
import { useZodForm } from "../../../shared/hooks/useZodForm";

const ChangePassword = (props: { onClose: () => void }) => {
    const { showSuccess, showError } = useToast();
    const { register, handleSubmit, formState: { errors } } = useZodForm(changePasswordSchema);

    const onSubmit = async (data: ChangePasswordFormData) => {
        try {
            const response = await userRepository.changePassword({
                oldPassword: data.oldPassword,
                newPassword: data.newPassword
            });

            if (response.isSuccess) {
                showSuccess('Password has been successfully changed');
                props.onClose();
            } else if (response.error) {
                showError(response.error.message);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            showError('An error occurred while changing the password.');
        }
    };

    return (
        <ChangeCreds
            buttonLabel="Change password"
            title='Change password'
            buttonHandler={handleSubmit(onSubmit)}
        >
            <Box
                component="form"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(onSubmit)(e);
                }}
                sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
            >
                <PasswordInput
                    register={register('oldPassword')}
                    placeholder={'Old password'}
                    error={errors['oldPassword']}
                />
                <PasswordInput
                    register={register('newPassword')}
                    placeholder={'New Password'}
                    error={errors['newPassword']}
                />
                <PasswordInput
                    register={register('confirmPassword')}
                    placeholder={'Confirm password'}
                    error={errors['confirmPassword']}
                />
            </Box>
        </ChangeCreds>
    );
};

export default ChangePassword;
