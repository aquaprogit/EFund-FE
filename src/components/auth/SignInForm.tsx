import { Box, Button, Dialog, Divider, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthGoogleButton from "./SignInGoogle";
import { useZodForm } from "../../hooks/useZodForm";
import { SignInFormData, signInSchema } from "../../schemas/auth/signInSchema";
import { userRepository } from "../../repository/userRepository";
import { useToast } from "../../contexts/ToastContext";

interface SignInFormProps {
    onSubmit: (data: SignInFormData) => void;
}

const SignInForm = (props: SignInFormProps) => {
    const { register, handleSubmit, getValues, formState: { errors } } = useZodForm(signInSchema);

    const { showSuccess, showError } = useToast();
    const [dialogOpened, setDialogOpened] = useState<boolean>(false);
    const navigate = useNavigate();

    return (
        <Box width='400px'>
            <Box
                display={'flex'}
                flexDirection={'column'}
                sx={{ gap: 3, margin: 5, mt: 2, mb: 2 }}
                component="form"
                onSubmit={handleSubmit(props.onSubmit)}>
                <TextField
                    id="email"
                    label="Email"
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    variant="standard"
                />
                <TextField
                    id="password"
                    type="password"
                    label="Password"
                    {...register('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    variant="standard"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="medium"
                    sx={{ width: 'max-content', alignSelf: 'center' }}>
                    Sign In
                </Button>
            </Box>
            <Divider />
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                margin: 5,
                mt: 2,
                mb: 2
            }}>
                <Button
                    style={{ textTransform: 'none' }}
                    variant="text"
                    onClick={() => navigate('/sign-up')} >
                    <Typography variant="caption" color={'text.primary'}>Don't have an account?</Typography>
                </Button>
                <Button
                    style={{ textTransform: 'none' }}
                    variant="text"
                    onClick={() => setDialogOpened(true)}>
                    <Typography variant="caption" color={'text.primary'}>Forgot password?</Typography>
                </Button>
            </Box>
            <Divider />
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                margin: 5,
                mt: 2,
                mb: 2
            }}>
                <AuthGoogleButton type="sign-in" label="Sign in with Google" />
            </Box>
            <Dialog
                onClose={() => setDialogOpened(false)}
                open={dialogOpened}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    margin: 5,
                    mt: 2,
                    mb: 2
                }}>
                    <Typography variant="h6">Forgot password?</Typography>
                    <Typography variant="body1">Enter your email address and we will send you a link to reset your password.</Typography>
                    <TextField
                        id="email"
                        label="Email"
                        {...register('email')}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        variant="standard"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="medium"
                        onClick={async () => {
                            const result = await userRepository.forgotPassword(getValues('email'));
                            if (result.isSuccess) {
                                showSuccess('Check your email for further instructions');
                            } else {
                                showError(result.error?.message ?? 'Error during sending email');
                            }
                            setDialogOpened(false);
                        }}
                        sx={{ width: 'max-content', alignSelf: 'center' }}>
                        Send
                    </Button>
                </Box>
            </Dialog>
        </Box>
    );
};

export default SignInForm;