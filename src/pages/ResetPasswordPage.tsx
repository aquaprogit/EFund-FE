import { useForm } from 'react-hook-form';
import { ResetPasswordFormFields } from '../models/form/auth/AuthFormFields';
import { Box, TextField, Button, Paper, Typography } from '@mui/material';
import Auth from '../services/api/Auth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useInfo from '../hooks/useInfo';
import { yupResolver } from '@hookform/resolvers/yup';
import ResetPasswordValidation from '../validation/forms/ResetPasswordValidation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ResetPasswordPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const email = searchParams.get('email')!;
    const token = searchParams.get('token')!;

    console.log({ email, token })

    const navigate = useNavigate();
    const { sendNotification } = useInfo();

    const { register, handleSubmit, getValues, formState: { errors } } = useForm<ResetPasswordFormFields>({
        resolver: yupResolver(ResetPasswordValidation),
        reValidateMode: 'onChange',
        mode: 'onTouched',
    });

    return (
        <Paper
            elevation={3}
            sx={{
                position: 'relative',
                padding: '50px 5px',
                minHeight: '400px',
                margin: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '15px',
                    left: '15px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer'
                }}
                onClick={() => navigate('/sign-in')}>
                <ArrowBackIcon />
            </Box>
            <Box>
                <Typography variant='h4'>
                    Reset Password
                </Typography>
            </Box>
            <Box width='400px'>
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    sx={{ gap: 3, margin: 5, mt: 2, mb: 2 }}
                    component="form"
                    onSubmit={handleSubmit(async (formFields) => {
                        const request = { newPassword: getValues('password'), email, token };
                        const result = await Auth.resetPassword(request);
                        if (result && result.success) {
                            sendNotification('success', 'Password changed successfully');
                        }
                        else {
                            sendNotification('error', result?.error?.message ?? 'Error during changing password');
                        }
                        navigate('/sign-in');
                    })}>
                    <TextField
                        id="password"
                        type="password"
                        label="Password"
                        {...register('password')}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        variant="standard"
                    />
                    <TextField
                        id="confirmPassword"
                        type="password"
                        label="Confirm Password"
                        {...register('confirmPassword')}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        variant="standard"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="medium"
                        sx={{ width: 'max-content', alignSelf: 'center' }}>
                        Update Password
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default ResetPasswordPage;